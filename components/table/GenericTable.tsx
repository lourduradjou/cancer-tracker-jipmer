'use client'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { useAuth } from '@/contexts/AuthContext'
import { useFilteredPatients } from '@/hooks/useFilteredPatients'
import { usePagination } from '@/hooks/usePagination'

import DeleteEntityDialog from '@/components/dialogs/DeleteEntityDialog'
import { hospitalFields } from '@/constants/hospital'
import { patientFields } from '@/constants/patient'
import { SEARCH_FIELDS } from '@/constants/search-bar'
import { userFields } from '@/constants/user'
import { useSearch } from '@/hooks/useSearch'
import { useStats } from '@/hooks/useStats'
import { useTableData } from '@/hooks/useTableData'
import { Hospital } from '@/schema/hospital'
import { Patient } from '@/schema/patient'
import { UserDoc } from '@/schema/user'
import { useCallback, useEffect, useMemo, useState } from 'react'
import ViewDetailsDialog from '../dialogs/ViewDetailsDialog'
import GenericPagination from './GenericPagination'
import GenericRow from './GenericRow'
import GenericToolbar from './GenericToolbar'
import { useTableStore, isPatient, isHospital, isUserDoc } from '@/store/table-store'
export default function GenericTable({
    headers,
    activeTab,
}: {
    headers: {
        name: string
        key: string
    }[]
    activeTab: 'ashas' | 'doctors' | 'nurses' | 'hospitals' | 'patients'
}) {
    const stableHeaders = useMemo(() => headers, [headers])
    const [rowsPerPage, setRowsPerPage] = useState(8) // Initial default
    const { user, role, orgId, isLoadingAuth } = useAuth()
    const { selectedRow, modal, setSelectedRow, openModal, closeModal } = useTableStore()

    const queryProps = {
        orgId,
        ashaEmail: role === 'asha' ? user?.email : null,
        enabled: !isLoadingAuth,
        adminRequiredData: activeTab,
    }

    const fieldsMap = {
        patients: patientFields,
        hospitals: hospitalFields,
        doctors: userFields,
        nurses: userFields,
        ashas: userFields,
    } as const

    const fieldsToDisplay = fieldsMap[activeTab]

    const { data = [] } = useTableData(queryProps) ?? {}

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

    const searchFields = SEARCH_FIELDS[activeTab]

    const isPatientTab = activeTab === 'patients'
    const patients = (data as Patient[]) ?? []
    const filteredPatients = useFilteredPatients(isPatientTab ? patients : [])

    // ✅ Choose correct baseData (patients → filtered first, others → raw data)
    const baseData = isPatientTab ? filteredPatients : (data ?? [])

    type TabDataMap = {
        patients: Patient
        hospitals: Hospital
        doctors: UserDoc
        nurses: UserDoc
        ashas: UserDoc
    }

    type ActiveDataType = TabDataMap[typeof activeTab] // infer based on activeTab

    const {
        filteredRows: searchedData,
        searchTerm,
        setSearchTerm,
    } = useSearch<ActiveDataType>(baseData, searchFields)

    // ✅ Use searchedData for pagination
    const dataToPaginate = useMemo(() => searchedData, [searchedData])

    const tableData = usePagination<(typeof dataToPaginate)[number]>(dataToPaginate, rowsPerPage)

    const { paginated: paginatedData, currentPage, totalPages, setCurrentPage } = tableData

    const tableStats = useStats({
        TableData: paginatedData ?? [],
        isPatientTab,
    })

    useEffect(() => {
        setCurrentPage(1)
    }, [filteredPatients.length, setCurrentPage])

    // Replace RowDataType with the actual TabDataMap type
    // In GenericTable component - REPLACE the callback section with this:

    type RowDataBase = {
        id: string | number
        [key: string]: unknown
    }

    type HandleViewFn = (d: RowDataBase) => void

    const handleView: HandleViewFn = useCallback(
        (row) => {
            setSelectedRow(row as TabDataMap[typeof activeTab])
            openModal('view')
        },
        [activeTab, setSelectedRow, openModal]
    )

    type HandleUpdateFn = (d: RowDataBase) => void

    const handleUpdate: HandleUpdateFn = useCallback(
        (row) => {
            setSelectedRow(row as TabDataMap[typeof activeTab])
            openModal('update')
        },
        [activeTab, setSelectedRow, openModal]
    )

    type HandleDeleteFn = (d: RowDataBase) => void

    const handleDelete: HandleDeleteFn = useCallback(
        (row) => {
            setSelectedRow(row as TabDataMap[typeof activeTab])
            openModal('delete')
        },
        [activeTab, setSelectedRow, openModal]
    )

    return (
        <div className="flex min-h-screen flex-col">
            <GenericToolbar
                activeTab={activeTab}
                getExportData={() => {
                    if (activeTab === 'patients') return filteredPatients
                    if (activeTab === 'hospitals') return (data ?? []) as Hospital[]
                    return data ?? [] // doctors, nurses, ashas
                }}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
            />

            <Table className="border-border flex-1 overflow-auto rounded-md border">
                <TableHeader className="bg-muted">
                    <TableRow className="border-border border-b">
                        <TableHead className="border-border w-12 border-r text-center">
                            S/NO
                        </TableHead>
                        {headers.map((header, id) => (
                            <TableHead className="border-border w-12 border-r text-center" key={id}>
                                {header.name}
                            </TableHead>
                        ))}
                        <TableHead className="border-border w-12 border-r text-center">
                            Actions
                        </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {paginatedData.length > 0 ? (
                        paginatedData.map((data, index) => (
                            <GenericRow
                                isPatientTab={isPatientTab}
                                key={index}
                                rowData={data}
                                index={(currentPage - 1) * rowsPerPage + index}
                                onView={handleView}
                                onUpdate={handleUpdate}
                                onDelete={handleDelete}
                                headers={stableHeaders}
                            />
                        ))
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={8}
                                className="text-muted-foreground py-10 text-center text-sm"
                            >
                                No matching patients found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            <div className="">
                <GenericPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    stats={tableStats} // only show stats for patients
                    isPatientTab={isPatientTab}
                />
            </div>

            {selectedRow && modal === 'view' && (
                <>
                    <ViewDetailsDialog
                        open={modal === 'view'}
                        onOpenChange={(open) => !open && closeModal()}
                        rowData={selectedRow}
                        fieldsToDisplay={fieldsToDisplay}
                    />
                    {/* <GenericPatientDialog
                            mode='edit'
                        /> */}
                </>
            )}
            <DeleteEntityDialog
                open={modal === 'delete'} // <-- control it explicitly
                entity={selectedRow}
                collectionName={activeTab}
                displayField="name"
                onClose={closeModal}
                onDeleted={() => closeModal()}
                // onDeleted={(deletedId) => {
                //     setShowDelete(false)
                //     setSelectedRowData(null)
                //     console.log('Deleted:', deletedId)
                // }}
            />
        </div>
    )
}
