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
import { usePathname } from 'next/navigation'
import AddHospitalDialog from '../forms/hospital/AddHospitalDialog'
import AddUserDialog from '../forms/user/AddUserDialog'
import { SearchInput } from '../search/SearchInput'
import {PatientFilter} from '.'
import GenericPatientDialog from '../forms/patient/GenericPatientDialog'
import { MoreVertical } from 'lucide-react'

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

  const dashboardTitleContent = pathname.includes('/admin')
    ? 'Admin Dashboard'
    : pathname.includes('/nurse')
    ? <h1 className="text-2xl font-bold">Nurse Dashboard</h1>
    : <h1 className="text-2xl font-bold">Doctor Dashboard</h1>

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

        {/* Three-dot Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {/* Import */}
            <DropdownMenuItem
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              Import
            </DropdownMenuItem>
            <input
              id="file-upload"
              type="file"
              accept=".csv, .xlsx, .xls"
              className="hidden"
              onChange={(e) => importData(e, activeTab, queryClient)}
            />

            {/* Export */}
            <DropdownMenuItem onClick={handleExportCSV}>
              Export as CSV
            </DropdownMenuItem>
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
