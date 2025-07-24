'use client'

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { db } from '@/firebase'
import { Patient } from '@/types/patient'
import { deleteDoc, doc } from 'firebase/firestore'
import { usePathname } from 'next/navigation'
import { useMemo, useState } from 'react'
import DeletePatientDialog from './DeletePatientDialog'
import PatientRow from './PatientRow'
import PatientToolbar from './PatientToolbar'
import UpdatePatientDialog from './UpdatePatientDialog'
import ViewPatientDialog from './ViewPatientDialog'

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

	const [filterStatuses, setFilterStatuses] = useState<string[]>([])
	const [ageFilter, setAgeFilter] = useState<string | null>(null)
	const [minAge, setMinAge] = useState<number | null>(null)
	const [maxAge, setMaxAge] = useState<number | null>(null)
	const [filterRationColors, setFilterRationColors] = useState<string[]>([])

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
		const result = patients.filter((p) => {
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

			const matchStatus =
				filterStatuses.length === 0 ||
				filterStatuses.includes(p.status?.toLowerCase())

			const matchRationCard =
				filterRationColors.length === 0 ||
				filterRationColors.includes(p.rationColor?.toLowerCase())

			const dob = new Date(p.dob)
			const today = new Date()
			const ageInYears =
				(today.getTime() - dob.getTime()) /
				(1000 * 60 * 60 * 24 * 365.25)

			const matchAgeFilter =
				!ageFilter ||
				(ageFilter === '<6mo' && ageInYears < 0.5) ||
				(ageFilter === '<1yr' && ageInYears < 1)

			const matchMinAge = minAge === null || ageInYears >= minAge
			const matchMaxAge = maxAge === null || ageInYears <= maxAge

			return (
				matchSearch &&
				matchSex &&
				matchDisease &&
				matchStatus &&
				matchRationCard &&
				matchAgeFilter &&
				matchMinAge &&
				matchMaxAge
			)
		})

		// Sort Alive first, then others (e.g., Death)
		return result.sort((a, b) => {
			if (a.status === 'alive' && b.status !== 'alive') return -1
			if (a.status !== 'alive' && b.status === 'alive') return 1
			return 0
		})
	}, [
		patients,
		searchTerm,
		filterSexes,
		filterDiseases,
		filterStatuses,
		filterRationColors,
		ageFilter,
		minAge,
		maxAge,
	])

	const exportData = filteredPatients.map((p) => ({
		id: p.id,
		name: p.name,
		phoneNumber: p.phoneNumber,
		sex: p.sex || 'Not specified',
		dob: p.dob || 'Not specified',
		address: p.address || 'Not specified',
		aadhaarId: p.aadhaarId || 'Not specified',
		rationCardColor: p.rationCardColor || 'Not specified',
		diseases: p.diseases?.length ? p.diseases.join(', ') : 'None',
		assignedPhc: p.assignedPhc || 'Not assigned',
		assignedAsha: p.assignedAsha || 'Not assigned',
		gpsLocation: p.gpsLocation
			? `${p.gpsLocation.lat}, ${p.gpsLocation.lng}`
			: 'Not available',
		followUps: p.followUps?.length
			? p.followUps
					.map((f, i) => `#${i + 1}: ${f.date} - ${f.remarks}`)
					.join(' | ')
			: 'None',
		status: p.status || 'Not specified',
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
				filterStatuses={filterStatuses}
				setFilterStatuses={setFilterStatuses}
				ageFilter={ageFilter}
				setAgeFilter={setAgeFilter}
				minAge={minAge}
				setMinAge={setMinAge}
				maxAge={maxAge}
				setMaxAge={setMaxAge}
				filterRationColors={filterRationColors}
				setFilterRationColors={setFilterRationColors}
				exportData={exportData}
				setPatients={setPatients}
			/>

			<Table className='border border-border rounded-md'>
				<TableHeader className='bg-muted'>
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
							Age
						</TableHead>
						<TableHead className='border-r border-border'>
							Diseases
						</TableHead>
						<TableHead className='border-r border-border'>
							Status
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
