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
	minAge,
	setMinAge,
	maxAge,
	setMaxAge,
	filterRationColors,
	setFilterRationColors,
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
	setAgeFilter: (val: string | null) => void
	minAge: number | null
	setMinAge: (val: number | null) => void
	maxAge: number | null
	setMaxAge: (val: number | null) => void
	filterRationColors: string[]
	setFilterRationColors: (colors: string[]) => void
	exportData: Patient[] // you could also use a specific shape if needed
	setPatients: React.Dispatch<React.SetStateAction<Patient[]>>
}) {
	const pathname = usePathname()
	const userRole = pathname.includes('/nurse')
		? 'Nurse Dashboard'
		: 'Doctor Dashboard'

	return (
		<div className='flex justify-between items-center mb-4'>
			<h1 className='text-2xl font-bold'>{userRole}</h1>	
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
					minAge={minAge}
					setMinAge={setMinAge}
					maxAge={maxAge}
					setMaxAge={setMaxAge}
					filterRationColors={filterRationColors}
					setFilterRationColors={setFilterRationColors}
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
			</div>
		</div>
	)
}
