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
import GenericUserForm from './GenericUserForm'

import { db } from '@/firebase'
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore'
import { toast } from 'sonner'
import { UserDoc, UserFormInputs } from '@/schema/user'
import { useQueryClient } from '@tanstack/react-query'

interface GenericUserDialogProps {
  mode: 'add' | 'edit'
  userType: string
  userData?: UserDoc // only for edit
  trigger?: React.ReactNode
  onSuccess?: () => void
}

export default function GenericUserDialog({
  mode,
  userType,
  userData,
  trigger,
  onSuccess,
}: GenericUserDialogProps) {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  const onSubmit = async (data: UserFormInputs) => {
    try {
      if (mode === 'add') {
        await addDoc(collection(db, 'users'), data)
        toast.success(`${userType?.slice(0, -1)} added successfully.`)
      } else if (mode === 'edit' && userData?.id) {
        await updateDoc(doc(db, 'users', userData.id), data)
        toast.success(`${userType?.slice(0, -1)} updated successfully.`)
      }

      queryClient.invalidateQueries({ queryKey: ['users', userType] })
      setOpen(false)
      onSuccess?.()
    } catch (err) {
      console.error(`Error saving ${userType}:`, err)
      toast.error(`Failed to save ${userType?.slice(0, -1)}. Please try again.`)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button
            variant="outline"
            className="cursor-pointer border-2 !border-green-400 capitalize"
          >
            <Plus className="h-4 w-4" /> Add {userType?.slice(0, -1)}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {mode === 'add'
              ? `Add New ${userType?.slice(0, -1)}`
              : `Edit ${userType?.slice(0, -1)}`}
          </DialogTitle>
        </DialogHeader>
        <GenericUserForm
          user={userType}
          defaultValues={mode === 'edit' ? userData : undefined}
          onSubmit={onSubmit}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
