'use client'

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination'
import { db } from '@/firebase'
import { Patient } from '@/types/patient'
import { deleteDoc, doc } from 'firebase/firestore'
import { usePathname } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
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

	const [rowsPerPage, setRowsPerPage] = useState(8) // Initial default

	// Responsive row count based on screen
	useEffect(() => {
		let resizeTimeout: NodeJS.Timeout

		const calculateRows = () => {
			const windowHeight = window.innerHeight
			const reservedHeight = 300
			const rowHeight = 52
			const usable = windowHeight - reservedHeight
			const rows = Math.max(4, Math.floor(usable / rowHeight))
			setRowsPerPage(rows)
		}

		const handleResize = () => {
			clearTimeout(resizeTimeout)
			resizeTimeout = setTimeout(calculateRows, 150) // debounce by 150ms
		}

		calculateRows()
		window.addEventListener('resize', handleResize)

		return () => {
			window.removeEventListener('resize', handleResize)
			clearTimeout(resizeTimeout)
		}
	}, [])

	const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
	const [showView, setShowView] = useState(false)
	const [showUpdate, setShowUpdate] = useState(false)
	const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null)

	const [searchTerm, setSearchTerm] = useState('')
	const [filterSexes, setFilterSexes] = useState<string[]>([])
	const [filterDiseases, setFilterDiseases] = useState<string[]>([])

	// ✅ CORRECTED: Initializing with an empty array applies no default filter,
	// allowing your sorting logic to handle the initial view.
	const [filterStatuses, setFilterStatuses] = useState<string[]>([])

	const [ageFilter, setAgeFilter] = useState<string | null>(null)
	const [minAge, setMinAge] = useState<number | null>(null)
	const [maxAge, setMaxAge] = useState<number | null>(null)
	const [filterRationColors, setFilterRationColors] = useState<string[]>([])

	// State for pagination
	const [currentPage, setCurrentPage] = useState(1)
	const ROWS_PER_PAGE = rowsPerPage

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
		// First, the list is filtered based on user selections
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

		// Then, the filtered list is sorted. This runs on the initial render.
		return result.sort((a, b) => {
			if (
				a.status?.toLowerCase() === 'alive' &&
				b.status?.toLowerCase() !== 'alive'
			)
				return -1
			if (
				a.status?.toLowerCase() !== 'alive' &&
				b.status?.toLowerCase() === 'alive'
			)
				return 1
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

	useEffect(() => {
		setCurrentPage(1)
	}, [filteredPatients.length])

	const totalPages = Math.ceil(filteredPatients.length / ROWS_PER_PAGE)
	const startIndex = (currentPage - 1) * ROWS_PER_PAGE
	const paginatedPatients = filteredPatients.slice(
		startIndex,
		startIndex + ROWS_PER_PAGE
	)

	useEffect(() => {
		if (currentPage > totalPages) {
			setCurrentPage(totalPages)
		}
	}, [totalPages, currentPage])

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
		<div className=''>
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
					{paginatedPatients.length > 0 ? (
						paginatedPatients.map((patient, index) => (
							<PatientRow
								key={patient.id}
								patient={patient}
								index={startIndex + index}
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
								colSpan={8}
								className='text-center text-sm text-muted-foreground py-10'
							>
								No matching patients found.
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>

			{totalPages > 1 && (
				<div className='flex justify-center items-center mt-4'>
					<Pagination>
						<PaginationContent>
							<PaginationItem>
								<PaginationPrevious
									href='#'
									onClick={(e) => {
										e.preventDefault()
										setCurrentPage((prev) =>
											Math.max(prev - 1, 1)
										)
									}}
									className={
										currentPage === 1
											? 'pointer-events-none opacity-50'
											: undefined
									}
								/>
							</PaginationItem>

							{Array.from(
								{ length: totalPages },
								(_, i) => i + 1
							).map((page) => (
								<PaginationItem key={page}>
									<PaginationLink
										href='#'
										onClick={(e) => {
											e.preventDefault()
											setCurrentPage(page)
										}}
										isActive={currentPage === page}
									>
										{page}
									</PaginationLink>
								</PaginationItem>
							))}

							<PaginationItem>
								<PaginationNext
									href='#'
									onClick={(e) => {
										e.preventDefault()
										setCurrentPage((prev) =>
											Math.min(prev + 1, totalPages)
										)
									}}
									className={
										currentPage === totalPages
											? 'pointer-events-none opacity-50'
											: undefined
									}
								/>
							</PaginationItem>
						</PaginationContent>
					</Pagination>
				</div>
			)}

			{/* Modals and Dialogs */}
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

			<DeletePatientDialog
				patient={patientToDelete}
				onClose={() => setPatientToDelete(null)}
				onDeleted={(deletedId) =>
					setPatients((prev) =>
						prev.filter((p) => p.id !== deletedId)
					)
				}
			/>
		</div>
	)
}
