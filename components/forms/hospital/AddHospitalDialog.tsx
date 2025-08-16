'use client'

import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import AddHospitalForm from './AddHospitalForm'

import { db } from '@/firebase'
import { addDoc, collection } from 'firebase/firestore'
import { toast } from 'sonner'
import { HospitalFormInputs } from '@/schema/hospital'
import { useQueryClient } from '@tanstack/react-query'

export default function AddHospitalDialog() {
    const [open, setOpen] = useState(false)
    const queryClient = useQueryClient()

    const onSubmit = async (data: HospitalFormInputs) => {
        try {
            await addDoc(collection(db, 'hospitals'), data)
            toast.success('Hospital added successfully.')

            // 🔹 Invalidate hospitals query so useTableData refetches
            queryClient.invalidateQueries({ queryKey: ['hospitals'] })

            setOpen(false)
        } catch (err) {
            console.error('Error adding hospital:', err)
            toast.error('Failed to add hospital. Please try again.')
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className="cursor-pointer border-2 !border-green-400 capitalize"
                >
                    <Plus className="h-4 w-4" /> Add Hospital
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Add New Hospital</DialogTitle>
                </DialogHeader>
                <AddHospitalForm onSuccess={() => setOpen(false)} onSubmit={onSubmit} />
            </DialogContent>
        </Dialog>
    )
}
