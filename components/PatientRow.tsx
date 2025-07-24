'use client'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import { Eye, Pencil, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { TableCell, TableRow } from '@/components/ui/table'
import { db } from '@/firebase'
import { Patient } from '@/types/patient'
import { doc, updateDoc } from 'firebase/firestore'
import { usePathname } from 'next/navigation'
import TransferDialog from './TransferDialog'
import PhoneCell from './PhoneCell'

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
	const getAge = (dob?: string): string => {
		if (!dob) return 'N/A'

		const [day, month, year] = dob.split('-').map(Number)
		if (!day || !month || !year) return 'Invalid'

		const birthDate = new Date(year, month - 1, day)
		if (isNaN(birthDate.getTime())) return 'Invalid'

		const today = new Date()

		let years = today.getFullYear() - birthDate.getFullYear()
		let months = today.getMonth() - birthDate.getMonth()
		let days = today.getDate() - birthDate.getDate()

		if (days < 0) {
			months--
			const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0)
			days += prevMonth.getDate()
		}

		if (months < 0) {
			years--
			months += 12
		}

		if (years >= 1) {
			return `${years} yrs`
		} else if (months >= 1) {
			return `${months} month${months > 1 ? 's' : ''}`
		} else {
			return `<1 month`
		}
	}

	return (
		<TableRow className='border-b border-border font-light'>
			<TableCell className='border-r border-border text-center'>
				{index + 1}
			</TableCell>
			<TableCell className='border-r border-border capitalize font-semibold'>
				{patient.name}
			</TableCell>
			<TableCell className='border-r border-border'>
				<PhoneCell phoneNumbers={patient.phoneNumber} />
			</TableCell>
			<TableCell className='border-r border-border capitalize'>
				{patient.sex}
			</TableCell>
			<TableCell className='border-r border-border capitalize'>
				{getAge(patient.dob)}
			</TableCell>
			<TableCell className='border-r border-border whitespace-pre-wrap text-sm'>
				{patient.diseases?.length ? (
					patient.diseases.length > 1 ? (
						<ul className='list-disc list-inside space-y-1'>
							{patient.diseases.map((disease, i) => (
								<li key={i} className='capitalize'>
									{disease}
								</li>
							))}
						</ul>
					) : (
						<div className='capitalize'>{patient.diseases[0]}</div>
					)
				) : (
					<span className='text-muted-foreground italic'>
						No diseases listed
					</span>
				)}
			</TableCell>
			<TableCell className='border-r border-border'>
				<span
					className={`px-2 py-1 rounded font-medium capitalize tracking-wider
						${
							patient.status?.toLowerCase() === 'alive'
								? 'text-green-600 bg-border'
								: patient.status?.toLowerCase() === 'death'
								? 'text-red-600 bg-border'
								: patient.status?.toLowerCase() === 'ongoing'
								? 'text-blue-600 bg-border'
								: patient.status?.toLowerCase() === 'followup'
								? 'text-yellow-600 bg-border'
								: 'text-muted-foreground'
						}`}
				>
					{patient.status || 'None'}
				</span>
			</TableCell>
			<TableCell className='space-x-2 text-center'>
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								size='icon'
								variant='outline'
								onClick={() => onView(patient)}
							>
								<Eye className='w-4 h-4' />
							</Button>
						</TooltipTrigger>
						<TooltipContent>View</TooltipContent>
					</Tooltip>

					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								size='icon'
								variant='outline'
								onClick={() => onUpdate(patient)}
							>
								<Pencil className='w-4 h-4' />
							</Button>
						</TooltipTrigger>
						<TooltipContent>Update</TooltipContent>
					</Tooltip>

					<TransferDialog
						patient={patient}
						onTransfer={async (phc) => {
							try {
								if (!patient.id)
									throw new Error(
										'Missing patient document ID'
									)
								const patientRef = doc(
									db,
									'patients',
									patient.id
								)
								await updateDoc(patientRef, {
									assignedPhc: phc,
								})
								console.log(
									`Successfully transferred ${patient.name} to PHC ${phc}`
								)
								alert(`Transferred ${patient.name} to new PHC.`)
							} catch (err) {
								console.error('Transfer failed:', err)
								alert(
									'Transfer failed. See console for details.'
								)
							}
						}}
					/>

					{!isNurse && (
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									size='icon'
									variant='destructive'
									className='text-white'
									onClick={() => onDelete(patient)}
								>
									<Trash2 className='w-4 h-4' />
								</Button>
							</TooltipTrigger>
							<TooltipContent>Delete</TooltipContent>
						</Tooltip>
					)}
				</TooltipProvider>
			</TableCell>
		</TableRow>
	)
}
