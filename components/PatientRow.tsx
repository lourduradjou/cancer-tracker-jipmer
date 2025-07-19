'use client'

import { Button } from '@/components/ui/button'
import { TableCell, TableRow } from '@/components/ui/table'
import { Patient } from '@/types/patient'
import { usePathname } from 'next/navigation'

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

	return (
		<TableRow className='border-b border-border'>
			<TableCell className='border-r border-border text-center font-semibold'>
				{index + 1}
			</TableCell>
			<TableCell className='border-r border-border'>{patient.name}</TableCell>
			<TableCell className='border-r border-border'>{patient.phoneNumber}</TableCell>
			<TableCell className='border-r border-border'>{patient.sex}</TableCell>
			<TableCell className='border-r border-border'>{patient.dob}</TableCell>
			<TableCell className='border-r border-border whitespace-pre-wrap text-sm'>
				{patient.diseases?.length ? (
					patient.diseases.map((disease, i) => <div key={i}>🔹 {disease}</div>)
				) : (
					<span className='text-muted-foreground italic'>
						No diseases listed
					</span>
				)}
			</TableCell>
			<TableCell className='space-x-2'>
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
