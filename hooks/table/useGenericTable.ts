// hooks/table/useGenericTable.ts
import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useFilteredPatients } from './useFilteredPatients'
import { usePagination } from './usePagination'
import { useSearch } from './useSearch'
import { SEARCH_FIELDS } from '@/constants/search-bar'
import { patientFields } from '@/constants/patient'
import { hospitalFields } from '@/constants/hospital'
import { userFields } from '@/constants/user'
import { useTableStore } from '@/store/table-store'
import { Hospital } from '@/schema/hospital'
import { Patient } from '@/schema/patient'
import { UserDoc } from '@/schema/user'

type Tab = 'ashas' | 'doctors' | 'nurses' | 'hospitals' | 'patients' | 'removedPatients'

type TabDataMap = {
  patients: Patient
  hospitals: Hospital
  doctors: UserDoc
  nurses: UserDoc
  ashas: UserDoc
  removedPatients: Patient
}

export function useGenericTable<T extends Tab>(
  activeTab: T,
  data: TabDataMap[T][] = [],
  rowsPerPageDefault = 8
) {
  const { user, role, orgId, isLoadingAuth } = useAuth()
  const { selectedRow, modal, setSelectedRow, openModal, closeModal } = useTableStore()

  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageDefault)

  // Determine fields to display
  const fieldsMap = {
    patients: patientFields,
    hospitals: hospitalFields,
    doctors: userFields,
    nurses: userFields,
    ashas: userFields,
    removedPatients: patientFields,
  } as const
  const fieldsToDisplay = fieldsMap[activeTab]

  // Responsive rows per page
  useEffect(() => {
    let resizeTimeout: NodeJS.Timeout
    const calculateRows = () => {
      const usable = window.innerHeight - 300
      setRowsPerPage(Math.max(4, Math.floor(usable / 52)))
    }
    const handleResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(calculateRows, 150)
    }
    calculateRows()
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(resizeTimeout)
    }
  }, [])

  const isPatientTab = activeTab === 'patients'
  const filteredPatients = useFilteredPatients(isPatientTab ? (data as Patient[]) : [])

  // Base data: filtered patients or raw data
  const baseData = isPatientTab ? filteredPatients : (data ?? [])

  const { filteredRows: searchedData, searchTerm, setSearchTerm } = useSearch(baseData as TabDataMap[T][], SEARCH_FIELDS[activeTab])

  const tableData = usePagination(searchedData, rowsPerPage)

  return {
    rowsPerPage,
    setRowsPerPage,
    tableData,
    selectedRow,
    modal,
    setSelectedRow,
    openModal,
    closeModal,
    searchTerm,
    setSearchTerm,
    fieldsToDisplay,
    isPatientTab,
    filteredPatients,
  }
}
