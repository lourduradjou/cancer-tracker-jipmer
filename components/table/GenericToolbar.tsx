'use client'

import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { importData } from '@/lib/importUtils'
import { exportToCSV, exportToExcel } from '@/lib/patient/export'
import { generateDiseasePDF } from '@/lib/patient/generateDiseaseReport'
import { useQueryClient } from '@tanstack/react-query'
import { usePathname } from 'next/navigation'
import AddHospitalDialog from '../forms/hospital/AddHospitalDialog'
import AddUserDialog from '../forms/user/AddUserDialog'
import { SearchInput } from '../search/SearchInput'
import PatientFilter from './PatientFilter'
import GenericPatientDialog from '../forms/patient/GenericPatientDialog'

export default function GenericToolbar({
    activeTab,
    getExportData,
    searchTerm,
    setSearchTerm,
}: {
    activeTab: 'ashas' | 'hospitals' | 'doctors' | 'nurses' | 'patients' | 'removedPatients'
    getExportData: () => any[]
    searchTerm: string
    setSearchTerm: (val: string) => void
}) {
    const pathname = usePathname()
    let dashboardTitleContent
    const queryClient = useQueryClient()

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
                {activeTab === 'patients' && <GenericPatientDialog mode="add" />}
                {activeTab === 'hospitals' && <AddHospitalDialog />}
                {['ashas', 'doctors', 'nurses'].includes(activeTab) && (
                    <AddUserDialog user={activeTab} />
                )}

                {/* Import Button */}
                <div>
                    <input
                        id="file-upload"
                        type="file"
                        accept=".csv, .xlsx, .xls"
                        className="hidden"
                        onChange={(e) => importData(e, activeTab, queryClient)}
                    />
                    <Button
                        variant="outline"
                        onClick={() => document.getElementById('file-upload')?.click()}
                    >
                        Import
                    </Button>
                </div>

                {/* Export Dropdown */}
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
