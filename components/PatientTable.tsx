'use client'

import { useState, useMemo } from 'react'
import { deleteDoc, doc } from 'firebase/firestore'
import { usePathname } from 'next/navigation'
import { db } from '@/firebase'
import {
	Table,
	TableHeader,
	TableBody,
	TableRow,
	TableHead,
	TableCell,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import PatientFilter from './PatientFilter'
import { Patient } from '@/types/patient'
import AddPatientDialog from './AddPatientDialog'
import UpdatePatientDialog from './UpdatePatientDialog'
import ViewPatientDialog from './ViewPatientDialog'
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { exportToExcel, exportToCSV } from '@/lib/exportUtils'
import PatientRow from './PatientRow'
import PatientToolbar from './PatientToolbar'
import DeletePatientDialog from './DeletePatientDialog'

export default function PatientTable({
	patients,
	setPatients,
}: {
	patients: Patient[]
	setPatients: React.Dispatch<React.SetStateAction<Patient[]>>
}) {
	const pathname = usePathname()
	const isNurse = pathname.startsWith('/nurse')

	const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
	const [showView, setShowView] = useState(false)
	const [showUpdate, setShowUpdate] = useState(false)
	const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null)

	const [searchTerm, setSearchTerm] = useState('')
	const [filterSexes, setFilterSexes] = useState<string[]>([])
	const [filterDiseases, setFilterDiseases] = useState<string[]>([])

	const handleConfirmDelete = async () => {
		if (patientToDelete) {
			await deleteDoc(doc(db, 'patients', patientToDelete.id))
			setPatients((prev) =>
				prev.filter((p) => p.id !== patientToDelete.id)
			)
			setPatientToDelete(null)
		}
	}

	const filteredPatients = useMemo(() => {
		return patients.filter((p) => {
			const matchSearch =
				p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
				p.phoneNumber?.includes(searchTerm)

			const matchSex =
				filterSexes.length === 0 ||
				filterSexes.includes(p.sex?.toLowerCase())

			const matchDisease =
				filterDiseases.length === 0 ||
				p.diseases?.some((d) =>
					filterDiseases.includes(d.toLowerCase())
				)

			return matchSearch && matchSex && matchDisease
		})
	}, [patients, searchTerm, filterSexes, filterDiseases])

	const exportData = filteredPatients.map((p) => ({
		Name: p.name,
		Phone: p.phoneNumber,
		Sex: p.sex,
		DOB: p.dob,
		Diseases: p.diseases?.join(', ') || 'None',
	}))

	return (
		<>
			<PatientToolbar
				searchTerm={searchTerm}
				setSearchTerm={setSearchTerm}
				filterSexes={filterSexes}
				setFilterSexes={setFilterSexes}
				filterDiseases={filterDiseases}
				setFilterDiseases={setFilterDiseases}
				exportData={exportData}
				setPatients={setPatients}
			/>

			<Table className='border border-border rounded-md'>
				<TableHeader>
					<TableRow className='border-b border-border'>
						<TableHead className='border-r border-border w-12 text-center'>
							S.No
						</TableHead>
						<TableHead className='border-r border-border'>
							Patient Name
						</TableHead>
						<TableHead className='border-r border-border'>
							Phone
						</TableHead>
						<TableHead className='border-r border-border'>
							Sex
						</TableHead>
						<TableHead className='border-r border-border'>
							DOB
						</TableHead>
						<TableHead className='border-r border-border'>
							Diseases
						</TableHead>
						<TableHead className='text-center'>Actions</TableHead>
					</TableRow>
				</TableHeader>

				<TableBody>
					{filteredPatients.length > 0 ? (
						filteredPatients.map((patient, index) => (
							<PatientRow
								key={patient.id}
								patient={patient}
								index={index}
								onView={(p) => {
									setSelectedPatient(p)
									setShowView(true)
								}}
								onUpdate={(p) => {
									setSelectedPatient(p)
									setShowUpdate(true)
								}}
								onDelete={(p) => setPatientToDelete(p)}
							/>
						))
					) : (
						<TableRow>
							<TableCell
								colSpan={7}
								className='text-center text-sm text-muted-foreground'
							>
								No matching patients found.
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>

			{/* Modals */}
			{selectedPatient && (
				<>
					<ViewPatientDialog
						open={showView}
						onOpenChange={setShowView}
						patient={selectedPatient}
					/>
					<UpdatePatientDialog
						open={showUpdate}
						onOpenChange={setShowUpdate}
						patient={selectedPatient}
						setPatient={setSelectedPatient}
						setPatients={setPatients}
					/>
				</>
			)}

			{/* Delete Confirmation Dialog */}
			<DeletePatientDialog
				patient={patientToDelete}
				onClose={() => setPatientToDelete(null)}
				onDeleted={(deletedId) =>
					setPatients((prev) =>
						prev.filter((p) => p.id !== deletedId)
					)
				}
			/>
		</>
	)
}
