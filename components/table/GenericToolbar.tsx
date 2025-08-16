'use client'

import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { exportToCSV, exportToExcel } from '@/lib/patient/export'
import { usePathname } from 'next/navigation'
import AddPatientDialog from '../forms/patient/AddPatientDialog'
import PatientFilter from './PatientFilter'
import { generateDiseasePDF } from '@/lib/patient/generateDiseaseReport'
import AddHospitalDialog from '../forms/hospital/AddHospitalDialog'
import AddUserDialog from '../forms/user/AddUserDialog'
import { SearchInput } from '../search/SearchInput'

export default function GenericToolbar({
    activeTab,
    getExportData,
    searchTerm,
    setSearchTerm,
}: {
    activeTab: 'ashas' | 'hospitals' | 'doctors' | 'nurses' | 'patients'
    getExportData: () => any[]
    searchTerm: string
    setSearchTerm: (val: string) => void
}) {
    const pathname = usePathname()
    let dashboardTitleContent
    if (pathname.includes('/admin')) {
        dashboardTitleContent = 'Admin DashBoard'
    } else {
        const userRole = pathname.includes('/nurse') ? 'Nurse Dashboard' : 'Doctor Dashboard'
        dashboardTitleContent = <h1 className="text-2xl font-bold">{userRole}</h1>
    }

    const handleExportCSV = () => {
        const data = getExportData()
        exportToCSV(data, activeTab)
    }

    const handleExportExcel = () => {
        const data = getExportData()
        exportToExcel(data, activeTab)
    }

    return (
        <div className="mb-4 flex items-center justify-between">
            {dashboardTitleContent}
            <div className="flex items-center gap-2">
                {activeTab && (
                    <SearchInput
                        value={searchTerm}
                        onChange={setSearchTerm}
                        placeholder={`Search ${activeTab}...`}
                    />
                )}
                {activeTab === 'patients' && <PatientFilter />}
                {activeTab === 'patients' && <AddPatientDialog />}
                {activeTab === 'hospitals' && <AddHospitalDialog />}
                {['ashas', 'doctors', 'nurses'].includes(activeTab) && (
                    <AddUserDialog user={activeTab} />
                )}

                {/* //Todo: import button to handle multiple data to be inserted in the db */}

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button className="cursor-pointer" variant="outline">
                            Export
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={handleExportCSV}>Export as CSV</DropdownMenuItem>
                        <DropdownMenuItem onClick={handleExportExcel}>
                            Export as Excel
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                {activeTab === 'patients' && (
                    <Button variant="outline" onClick={() => generateDiseasePDF(getExportData())}>
                        Report
                    </Button>
                )}
            </div>
        </div>
    )
}
