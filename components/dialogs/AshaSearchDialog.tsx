'use client'

import { Button } from '@/components/ui/button'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from '@/components/ui/command'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { db } from '@/firebase'
import { Check, UserCheck, UserPlus, X } from 'lucide-react'
import { collection, getDocs, query, where, doc, updateDoc } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

type Asha = {
    id: string
    email: string
    username?: string
    phoneNumber?: string
}

interface AshaDialogProps {
    patientId: string
    assignedAshaId?: string // optional: current assigned ASHA
    onAssigned?: (ashaId: string | null) => void
}

export default function AshaSearchDialog({ patientId, assignedAshaId, onAssigned }: AshaDialogProps) {
    const [ashas, setAshas] = useState<Asha[]>([])
    const [selectedAsha, setSelectedAsha] = useState<Asha | null>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [open, setOpen] = useState(false)

    // Fetch ASHAs
    useEffect(() => {
        const fetchAshas = async () => {
            try {
                const q = query(collection(db, 'users'), where('role', '==', 'asha'))
                const snapshot = await getDocs(q)
                const ashaList: Asha[] = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...(doc.data() as Omit<Asha, 'id'>),
                }))
                setAshas(ashaList)
            } catch (error) {
                console.error('Error fetching ASHAs:', error)
            }
        }
        fetchAshas()
    }, [])

    // Preselect current ASHA
    useEffect(() => {
        if (!assignedAshaId || ashas.length === 0) {
            setSelectedAsha(null)
            return
        }
        const current = ashas.find(a => a.id === assignedAshaId)
        if (current) setSelectedAsha(current)
    }, [assignedAshaId, ashas])

    const filteredAshas = ashas
        .filter(
            (asha) =>
                asha.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                asha.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                asha.phoneNumber?.includes(searchTerm)
        )
        .slice(0, 10)

    const handleConfirm = async () => {
        try {
            const patientRef = doc(db, 'patients', patientId)
            await updateDoc(patientRef, { assignedAsha: selectedAsha?.id || '' }) // empty string = unassigned
            toast.success(
                selectedAsha ? 'ASHA assigned successfully!' : 'ASHA unassigned successfully!'
            )
            onAssigned?.(selectedAsha?.id || null)
            setOpen(false)
        } catch (err) {
            console.error(err)
            toast.error('Failed to update ASHA. Check console.')
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="icon" variant="outline" title="Assign ASHA">
                    {assignedAshaId !== 'none' && assignedAshaId ? (
                        <UserCheck className="h-4 w-4 text-green-600" />
                    ) : (
                        <UserPlus className="h-4 w-4" />
                    )}
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Assign ASHA</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <Command className="rounded-md border shadow-md">
                        <CommandInput
                            placeholder="Search ASHA by email, username, or phone..."
                            onValueChange={(val) => setSearchTerm(val)}
                        />
                        <CommandEmpty>No ASHA found.</CommandEmpty>
                        <CommandGroup>
                            {/* Special "Unassign" item */}
                            <CommandItem onSelect={() => setSelectedAsha(null)}>
                                <div className="flex w-full items-center justify-between">
                                    <span className="font-medium">Unassign ASHA</span>
                                    {selectedAsha === null && (
                                        <X className="h-4 w-4 text-red-600" />
                                    )}
                                </div>
                            </CommandItem>

                            {filteredAshas.map((asha) => (
                                <CommandItem key={asha.id} onSelect={() => setSelectedAsha(asha)}>
                                    <div className="flex w-full items-center justify-between">
                                        <div>
                                            <p className="font-medium">{asha.email}</p>
                                            {asha.username && (
                                                <p className="text-muted-foreground text-sm">
                                                    {asha.username}
                                                </p>
                                            )}
                                            {asha.phoneNumber && (
                                                <p className="text-muted-foreground text-sm">
                                                    {asha.phoneNumber}
                                                </p>
                                            )}
                                        </div>
                                        {selectedAsha?.id === asha.id && (
                                            <Check className="h-4 w-4 text-blue-600" />
                                        )}
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </Command>
                </div>

                <DialogFooter>
                    <Button onClick={handleConfirm}>
                        {selectedAsha ? 'Confirm ASHA' : 'Unassign ASHA'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
