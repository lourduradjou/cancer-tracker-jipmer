'use client'

import { Button } from '@/components/ui/button'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { db } from '@/firebase'
import { cn } from '@/lib/utils'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { Check, ChevronsUpDown } from 'lucide-react'
import { useEffect, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { PatientFormInputs } from '@/schema/patient'

// Define the shape of an Asha user object
type Asha = {
    id: string
    email: string
    username?: string
    phoneNumber?: string
}

interface AshaSearchProps {
    form: UseFormReturn<PatientFormInputs>
}

export default function AshaSearch({ form }: AshaSearchProps) {
    const [ashas, setAshas] = useState<Asha[]>([])
    const [open, setOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')

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

    const lowerSearch = searchTerm.toLowerCase()
    const filteredAshas = ashas
        .filter(
            (asha) =>
                asha.email.toLowerCase().includes(lowerSearch) ||
                asha.username?.toLowerCase().includes(lowerSearch) ||
                asha.phoneNumber?.includes(lowerSearch)
        )
        .slice(0, 5)

    const selectedAsha = ashas.find((asha) => asha.id === form.getValues('assignedAsha'))

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                >
                    <span className="text-muted-foreground truncate text-sm">
                        {selectedAsha?.email || 'Select ASHA...'}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command>
                    <CommandInput
                        placeholder="Search ASHA by email, username, or phone..."
                        onValueChange={(val) => setSearchTerm(val)}
                    />
                    <CommandEmpty>No ASHA found.</CommandEmpty>
                    <CommandGroup>
                        {filteredAshas.map((asha) => (
                            <CommandItem
                                key={asha.id}
                                value={asha.email}
                                onSelect={() => {
                                    form.setValue('assignedAsha', asha.id)
                                    setOpen(false)
                                }}
                            >
                                <Check
                                    className={cn(
                                        'mr-2 h-4 w-4',
                                        form.getValues('assignedAsha') === asha.id
                                            ? 'opacity-100'
                                            : 'opacity-0'
                                    )}
                                />
                                <div>
                                    <p className="font-medium">{asha.email}</p>
                                    {asha.username && (
                                        <p className="text-muted-foreground text-xs">
                                            {asha.username}
                                        </p>
                                    )}
                                    {asha.phoneNumber && (
                                        <p className="text-muted-foreground text-xs">
                                            {asha.phoneNumber}
                                        </p>
                                    )}
                                </div>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
