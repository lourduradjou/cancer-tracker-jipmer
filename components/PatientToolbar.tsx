'use client'

import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { exportToCSV, exportToExcel } from '@/lib/exportUtils'
import { Patient } from '@/types/patient'
import { usePathname } from 'next/navigation'
import AddPatientDialog from './AddPatientDialog'
import PatientFilter from './PatientFilter'
import { generateDiseasePDF } from '@/lib/generateDiseaseReport'

export default function PatientToolbar({
	searchTerm,
	setSearchTerm,
	filterSexes,
	setFilterSexes,
	filterDiseases,
	setFilterDiseases,
	filterStatuses,
	setFilterStatuses,
	ageFilter,
	setAgeFilter,
	filterRationColors,
	setFilterRationColors,
	assignedFilter,
	setAssignedFilter,
	transferFilter,
	setTransferFilter,
	exportData,
	setPatients,
}: {
	searchTerm: string
	setSearchTerm: (value: string) => void
	filterSexes: string[]
	setFilterSexes: (sexes: string[]) => void
	filterDiseases: string[]
	setFilterDiseases: (diseases: string[]) => void
	filterStatuses: string[]
	setFilterStatuses: (statuses: string[]) => void
	ageFilter: string | null
	setAgeFilter: (val: 'lt5' | 'lt20' | 'gt50' | null) => void
	filterRationColors: string[]
	setFilterRationColors: (colors: string[]) => void
	assignedFilter: 'assigned' | 'unassigned' | ''
	setAssignedFilter: (val: 'assigned' | 'unassigned' | '') => void
	transferFilter: 'transferred' | 'not_transferred' | ''
	setTransferFilter: (val: 'transferred' | 'not_transferred' | '') => void
	exportData: {
		id: string
		name: string
		phoneNumber: string[] | undefined
		sex: string
		dob: string
		address: string
		aadhaarId: string
		rationCardColor: string
		diseases: string
		assignedPhc: string
		assignedAsha: string
		gpsLocation: string
		followUps: string
		status: string
	}[]
	setPatients: React.Dispatch<React.SetStateAction<Patient[]>>
}) {
	const pathname = usePathname()
	let dashboardTitleContent
	if (pathname.includes('/admin')) {
		dashboardTitleContent = ''
		// dashboardTitleContent = (
		// 	<div className='flex gap-4'>
		// 		{/* You can make these actual tabs with state management if needed */}
		// 		<Button variant='ghost' className='text-lg font-semibold'>
		// 			Patients
		// 		</Button>
		// 		<Button variant='ghost' className='text-lg font-semibold'>
		// 			Doctors
		// 		</Button>
		// 		<Button variant='ghost' className='text-lg font-semibold'>
		// 			Nurses
		// 		</Button>
		// 	</div>
		// )
	} else {
		const userRole = pathname.includes('/nurse')
			? 'Nurse Dashboard'
			: 'Doctor Dashboard'
		dashboardTitleContent = (
			<h1 className='text-2xl font-bold'>{userRole}</h1>
		)
	}

	return (
		<div className='flex justify-between items-center mb-4'>
			{dashboardTitleContent}
			<div className='flex gap-2 items-center'>
				<PatientFilter
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
				/>

				<AddPatientDialog setPatients={setPatients} />

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button className=' cursor-pointer ' variant='outline'>
							Export
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuItem
							onClick={() => exportToCSV(exportData, 'patients')}
						>
							Export as CSV
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() =>
								exportToExcel(exportData, 'patients')
							}
						>
							Export as Excel
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>

				<Button
					variant='outline'
					onClick={() => generateDiseasePDF(exportData)}
				>
					Report
				</Button>
			</div>
		</div>
	)
}
