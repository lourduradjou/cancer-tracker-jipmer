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
import AddUserForm from './AddUserForm'

import { db } from '@/firebase'
import { addDoc, collection } from 'firebase/firestore'
import { toast } from 'sonner'
import { UserFormInputs } from '@/schema/user'
import { useQueryClient } from '@tanstack/react-query'

export default function AddUserDialog({ user }: { user: string }) {
    const [open, setOpen] = useState(false)
    const queryClient = useQueryClient()

    const onSubmit = async (data: UserFormInputs) => {
        try {
            await addDoc(collection(db, 'users'), data)
            toast.success(`${user.slice(0, -1)} added successfully.`)

            // 🔹 invalidate so useTableData refetches
            queryClient.invalidateQueries({ queryKey: ['users', user] })

            setOpen(false)
            localStorage.removeItem('addUserFormData')
        } catch (err) {
            console.error(`Error adding ${user}:`, err)
            toast.error(`Failed to add ${user.slice(0, -1)}. Please try again.`)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className="cursor-pointer border-2 !border-green-400 capitalize"
                >
                    <Plus className="h-4 w-4" /> Add {user.slice(0, -1)}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Add New {user.slice(0, -1)}</DialogTitle>
                </DialogHeader>
                <AddUserForm
                    user={user}
                    onSuccess={() => setOpen(false)}
                    onSubmit={onSubmit} // 🔹 pass Firestore save handler here
                />
            </DialogContent>
        </Dialog>
    )
}
