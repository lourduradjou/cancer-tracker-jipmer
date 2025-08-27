'use client'

import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Plus, Pencil } from 'lucide-react'
import { useState } from 'react'
import GenericHospitalForm from './GenericHospitalForm'

import { db } from '@/firebase'
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore'
import { toast } from 'sonner'
import { HospitalFormInputs } from '@/schema/hospital'
import { useQueryClient } from '@tanstack/react-query'

interface GenericHospitalDialogProps {
    mode: 'add' | 'edit'
    hospitalData?: HospitalFormInputs & { id?: string }
    trigger?: React.ReactNode
    onSuccess?: () => void
}

export default function GenericHospitalDialog({
    mode,
    hospitalData,
    trigger,
    onSuccess,
}: GenericHospitalDialogProps) {
    const [open, setOpen] = useState(false)
    const queryClient = useQueryClient()
    const isEdit = mode === 'edit'

    const onSubmit = async (data: HospitalFormInputs) => {
        try {
            if (isEdit && hospitalData?.id) {
                await updateDoc(doc(db, 'hospitals', hospitalData.id), data)
                toast.success('Hospital updated successfully.')
            } else {
                await addDoc(collection(db, 'hospitals'), data)
                toast.success('Hospital added successfully.')
            }

            // ✅ Invalidate hospitals query so tables refresh
            queryClient.invalidateQueries({ queryKey: ['hospitals'] })

            setOpen(false)
            onSuccess?.()
        } catch (err) {
            console.error(`Error ${isEdit ? 'updating' : 'adding'} hospital:`, err)
            toast.error(`Failed to ${isEdit ? 'update' : 'add'} hospital. Please try again.`)
        }
    }

    const defaultTrigger = isEdit ? (
        <Button size="icon" variant="outline" title="Update">
            <Pencil className="h-4 w-4" />
        </Button>
    ) : (
        <Button
            variant="outline"
            className="cursor-pointer border-2 !border-green-400 capitalize"
        >
            <Plus className="h-4 w-4" /> Add Hospital
        </Button>
    )

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>
                        {isEdit ? 'Update Hospital Details' : 'Add New Hospital'}
                    </DialogTitle>
                </DialogHeader>
                <GenericHospitalForm
                    initialData={hospitalData}
                    onSuccess={() => setOpen(false)}
                    onSubmit={onSubmit}
                />
            </DialogContent>
        </Dialog>
    )
}
