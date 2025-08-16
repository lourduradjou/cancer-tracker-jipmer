'use client'

import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { db } from '@/firebase'
import { deleteDoc, doc } from 'firebase/firestore'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

type DeleteEntityDialogProps<T extends { id: string }> = {
    open: boolean // <-- new prop
    entity: T | null
    collectionName: string
    displayField: keyof T
    onClose: () => void
    onDeleted?: (deletedId: string) => void
}

export default function DeleteEntityDialog<T extends { id: string }>({
    open,
    entity,
    collectionName,
    displayField,
    onClose,
    onDeleted,
}: DeleteEntityDialogProps<T>) {
    const queryClient = useQueryClient()

    const deleteMutation = useMutation({
        mutationFn: async (entityId: string) => {
            let coll = collectionName
            if (coll !== 'hospitals' && coll !== 'patients') {
                coll = 'users'
            }
            await deleteDoc(doc(db, coll, entityId))
            return entityId
        },
        onSuccess: (deletedId) => {
            if (collectionName === 'patients') queryClient.invalidateQueries({ queryKey: ['patients'] })
            else if (collectionName === 'hospitals') queryClient.invalidateQueries({ queryKey: ['hospitals'] })
            else queryClient.invalidateQueries({ queryKey: ['users'] })

            toast.success(`${entity?.[displayField] as string} deleted successfully`)

            onDeleted?.(deletedId)
            onClose()
        },
        onError: (err) => {
            toast.error(`Failed to delete ${entity?.[displayField] as string}`)
            console.error(err)
        },
    })

    const handleConfirmDelete = () => {
        if (!entity) return
        deleteMutation.mutate(entity.id)
    }

    return (
        <Dialog open={open} onOpenChange={onClose}> {/* use the explicit open prop */}
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirm Deletion</DialogTitle>
                </DialogHeader>
                <p>
                    Are you sure you want to delete{' '}
                    <strong className="text-red-600">{entity?.[displayField] as string}</strong>?
                </p>
                <p className="text-orange-500">Note*: This action cannot be undone.</p>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleConfirmDelete}
                        disabled={deleteMutation.isPending}
                    >
                        {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
