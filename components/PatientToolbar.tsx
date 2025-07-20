'use client'

import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import PatientFilter from './PatientFilter'
import AddPatientDialog from './AddPatientDialog'
import { Patient } from '@/types/patient'
import { exportToCSV, exportToExcel } from '@/lib/exportUtils'
import { usePathname } from 'next/navigation'

export default function PatientToolbar({
	searchTerm,
	setSearchTerm,
	filterSexes,
	setFilterSexes,
	filterDiseases,
	setFilterDiseases,
	exportData,
	setPatients,
}: {
	searchTerm: string
	setSearchTerm: (value: string) => void
	filterSexes: string[]
	setFilterSexes: (sexes: string[]) => void
	filterDiseases: string[]
	setFilterDiseases: (diseases: string[]) => void
	exportData: any[]
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
				/>

				<AddPatientDialog setPatients={setPatients} />

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button className='bg-blue-400 hover:bg-blue-500'>
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
							onClick={() => exportToExcel(exportData, 'patients')}
						>
							Export as Excel
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</div>
	)
}
