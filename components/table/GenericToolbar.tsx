'use client'

import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { importData } from '@/lib/import/importUtils'
import { exportToCSV, exportToExcel } from '@/lib/patient/export'
import { generateDiseasePDF } from '@/lib/patient/generateDiseaseReport'
import { useQueryClient } from '@tanstack/react-query'
import { MoreVertical } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { PatientFilter } from '.'
import GenericHospitalDialog from '../forms/hospital/GenericHospitalDialog'
import GenericPatientDialog from '../forms/patient/GenericPatientDialog'
import GenericUserDialog from '../forms/user/GenericUserDialog'
import { SearchInput } from '../search/SearchInput'
import { useAuth } from '@/contexts/AuthContext'

export function GenericToolbar({
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
    const queryClient = useQueryClient()
    const { role } = useAuth()

    const dashboardTitleContent = pathname.includes('/admin') ? (
        <h1 className="text-2xl font-bold hidden sm:block">Admin Dashboard</h1>
    ) : pathname.includes('/nurse') ? (
        <h1 className="text-2xl font-bold hidden sm:block">Nurse Dashboard</h1>
    ) : (
        <h1 className="text-2xl font-bold hidden sm:block">Doctor Dashboard</h1>
    )

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
            <div className="flex items-center gap-2 w-full justify-center sm:w-auto">
                {activeTab && (
                    <SearchInput
                        value={searchTerm}
                        onChange={setSearchTerm}
                        placeholder={`Search ${activeTab}...`}
                    />
                )}
                {activeTab === 'patients' && <PatientFilter />}
                {activeTab === 'patients' && <GenericPatientDialog mode="add" />}
                {activeTab === 'hospitals' && <GenericHospitalDialog mode="add" />}
                {['ashas', 'doctors', 'nurses'].includes(activeTab) && (
                    <GenericUserDialog mode="add" userType={activeTab} />
                )}

                {/* Three-dot Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {/* Import */}
                        {activeTab === 'patients' && role === 'admin' && (
                            <DropdownMenuItem
                                onSelect={(e) => {
                                    e.preventDefault() // ✅ stop default closing behavior if needed
                                    console.log('inside import button')
                                    document.getElementById('file-upload')?.click()
                                }}
                            >
                                Import
                            </DropdownMenuItem>
                        )}
                        <input
                            id="file-upload"
                            type="file"
                            accept=".csv, .xlsx, .xls"
                            className="hidden"
                            onChange={(e) => {
                                console.log('inside file upload')
                                importData(e, queryClient)
                            }}
                        />

                        {/* Export */}
                        <DropdownMenuItem onClick={handleExportCSV}>Export as CSV</DropdownMenuItem>
                        <DropdownMenuItem onClick={handleExportExcel}>
                            Export as Excel
                        </DropdownMenuItem>

                        {/* Report (only for patients) */}
                        {activeTab === 'patients' && (
                            <DropdownMenuItem onClick={() => generateDiseasePDF(getExportData())}>
                                Generate Report
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}
