'use client'

import { Button } from '@/components/ui/button'
import { TableCell, TableRow } from '@/components/ui/table'
import { Patient } from '@/types/patient'
import { usePathname } from 'next/navigation'
import TransferDialog from './TransferDialog'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '@/firebase'

export default function PatientRow({
	patient,
	index,
	onView,
	onUpdate,
	onDelete,
}: {
	patient: Patient
	index: number
	onView: (patient: Patient) => void
	onUpdate: (patient: Patient) => void
	onDelete: (patient: Patient) => void
}) {
	const pathname = usePathname()
	const isNurse = pathname.startsWith('/nurse')

	console.log(patient)

	// Calculate age from DOB
	const getAge = (dob?: string): number | string => {
		if (!dob) return 'N/A'

		// Parse dd-mm-yyyy format
		const [day, month, year] = dob.split('-').map(Number)
		if (!day || !month || !year) return 'Invalid'

		const birthDate = new Date(year, month - 1, day) // JS months are 0-based

		if (isNaN(birthDate.getTime())) return 'Invalid'

		const today = new Date()
		let age = today.getFullYear() - birthDate.getFullYear()

		const m = today.getMonth() - birthDate.getMonth()
		if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
			age--
		}

		return age
	}

	return (
		<TableRow className='border-b border-border'>
			<TableCell className='border-r border-border text-center font-semibold'>
				{index + 1}
			</TableCell>
			<TableCell className='border-r border-border'>
				{patient.name}
			</TableCell>
			<TableCell className='border-r border-border'>
				{patient.phoneNumber}
			</TableCell>
			<TableCell className='border-r border-border'>
				{patient.sex}
			</TableCell>
			<TableCell className='border-r border-border'>
				{getAge(patient.dob)} yrs
			</TableCell>
			<TableCell className='border-r border-border whitespace-pre-wrap text-sm'>
				{patient.diseases?.length ? (
					patient.diseases.map((disease, i) => (
						<div key={i}>🔹 {disease}</div>
					))
				) : (
					<span className='text-muted-foreground italic'>
						No diseases listed
					</span>
				)}
			</TableCell>
			<TableCell className='space-x-2 text-center'>
				<Button
					variant='outline'
					className='border-blue-500 text-blue-600 hover:bg-blue-50'
					onClick={() => onView(patient)}
				>
					View
				</Button>
				<Button
					variant='outline'
					className='border-amber-500 text-amber-600 hover:bg-amber-50'
					onClick={() => onUpdate(patient)}
				>
					Update
				</Button>

				<TransferDialog
					patient={patient}
					onTransfer={async (phc) => {
						try {
							if (!patient.id) {
								throw new Error('Missing patient document ID')
							}

							const patientRef = doc(db, 'patients', patient.id)
							await updateDoc(patientRef, { assignedPhc: phc })

							console.log(
								`Successfully transferred ${patient.name} to PHC ${phc}`
							)
							alert(`Transferred ${patient.name} to new PHC.`)
						} catch (err) {
							console.error('Transfer failed:', err)
							alert('Transfer failed. See console for details.')
						}
					}}
				/>

				{!isNurse && (
					<Button
						variant='destructive'
						onClick={() => onDelete(patient)}
					>
						Delete
					</Button>
				)}
			</TableCell>
		</TableRow>
	)
}
