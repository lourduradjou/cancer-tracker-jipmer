'use client'

import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { useFilteredPatients } from '@/hooks/useFilteredPatients'
import { usePagination } from '@/hooks/usePagination'
import { usePatientStats } from '@/hooks/usePatientStats'
import { Patient } from '@/types/patient'
import { useEffect, useState } from 'react'
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

	const [ageFilter, setAgeFilter] = useState<'lt5' | 'lt20' | 'gt50' | null>(
		null
	)
	const [assignedFilter, setAssignedFilter] = useState<
		'assigned' | 'unassigned' | ''
	>('')
	const [transferFilter, setTransferFilter] = useState<
		'transferred' | 'not_transferred' | ''
	>('')

	const [filterRationColors, setFilterRationColors] = useState<string[]>([])

	// Filtering
	const filteredPatients = useFilteredPatients(patients, {
		searchTerm,
		filterSexes,
		filterDiseases,
		filterStatuses,
		filterRationColors,
		ageFilter,
		assignedFilter,
		transferFilter,
	})

	const {
		paginated: paginatedPatients,
		currentPage,
		totalPages,
		setCurrentPage,
	} = usePagination(filteredPatients, rowsPerPage)

	// Stats
	const patientStats = usePatientStats(filteredPatients)

	useEffect(() => {
		setCurrentPage(1)
	}, [filteredPatients.length, setCurrentPage])

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
				filterRationColors={filterRationColors}
				setFilterRationColors={setFilterRationColors}
				assignedFilter={assignedFilter}
				setAssignedFilter={setAssignedFilter}
				transferFilter={transferFilter}
				setTransferFilter={setTransferFilter}
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
				<div className='flex justify-between items-center mt-4 flex-wrap gap-4'>
					{/* Stats Section */}
					<div className='text-sm font-light flex md:flex-row justify-between w-full'>
						<section className='flex space-x-4'>
							<div className='border px-2 py-1 tracking-wider'>
								Total Patients: {patientStats.total}
							</div>
							<div className='border px-2 py-1 tracking-wider'>
								Male: {patientStats.male}
							</div>
							<div className='border px-2 py-1 tracking-wider'>
								Female: {patientStats.female}
							</div>
							<div className='border px-2 py-1 tracking-wider'>
								Others: {patientStats.others}
							</div>
						</section>

						<section className='flex space-x-4'>
							<div className='border px-2 py-1 tracking-wider'>
								Assigned: {patientStats.assigned}
							</div>
							<div className='border px-2 py-1 tracking-wider'>
								Unassigned: {patientStats.unassigned}
							</div>
							<div className='border px-2 py-1 tracking-wider'>
								Alive: {patientStats.alive}
							</div>
							<div className='border px-2 py-1 tracking-wider'>
								Death: {patientStats.deceased}
							</div>
						</section>
					</div>

					{/* Pagination UI */}
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
