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
import { Patient } from '@/types/patient'
import { deleteDoc, doc } from 'firebase/firestore'

export default function DeletePatientDialog({
	patient,
	onClose,
	onDeleted,
}: {
	patient: Patient | null
	onClose: () => void
	onDeleted: (deletedId: string) => void
}) {
	const handleConfirmDelete = async () => {
		if (!patient) return
		await deleteDoc(doc(db, 'patients', patient.id))
		onDeleted(patient.id)
		onClose()
	}

	return (
		<Dialog open={!!patient} onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Confirm Deletion</DialogTitle>
				</DialogHeader>
				<p>
					Are you sure you want to delete{' '}
					<strong>{patient?.name}</strong>? This action cannot be
					undone.
				</p>
				<DialogFooter>
					<Button variant='outline' onClick={onClose}>
						Cancel
					</Button>
					<Button variant='destructive' onClick={handleConfirmDelete}>
						Delete
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
