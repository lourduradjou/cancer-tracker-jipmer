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
import DeletePatientDialog from '../dialogs/DeletePatientDialog'
import GenericRow from './GenericRow'
import PatientToolbar from './PatientToolbar'
import UpdatePatientDialog from '../dialogs/UpdatePatientDialog'
import ViewPatientDialog from '../dialogs/ViewPatientDialog'
import { useTableData } from '@/hooks/useTableData'
import { useAuth } from '@/contexts/AuthContext'
import { Hospital } from '@/types/schema/hospital'
import { UserDoc } from '@/types/user'

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
    console.log('Hi from tables')
    const [rowsPerPage, setRowsPerPage] = useState(8) // Initial default
    const { user, role, orgId, isLoadingAuth } = useAuth()

    // Use a single useTableData call with conditional props.
    const queryProps = {
        orgId,
        ashaEmail: role === 'asha' ? user?.email : null,
        enabled: !isLoadingAuth, // Enable once auth is loaded

        // Set the adminRequiredData prop based on the activeTab for admin users.
        adminRequiredData: activeTab,
    }

    // Correctly destructure the react-query result.
    // The type of `data` will be inferred based on the `adminRequiredData` prop.
    const { data, isLoading, isError } = useTableData(queryProps)

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
    const [filterStatuses, setFilterStatuses] = useState<string[]>([])

    const [ageFilter, setAgeFilter] = useState<'lt5' | 'lt20' | 'gt50' | null>(null)
    const [assignedFilter, setAssignedFilter] = useState<'assigned' | 'unassigned' | ''>('')
    const [transferFilter, setTransferFilter] = useState<'transferred' | 'not_transferred' | ''>('')

    const [filterRationColors, setFilterRationColors] = useState<string[]>([])

    // const isPatientTab = role !== 'admin'
    const isPatientTab = true
    const patients = isPatientTab ? (data as Patient[]) : undefined

    // Filtering

    const filteredPatients =
        isPatientTab &&
        useFilteredPatients(patients ?? [], {
            searchTerm,
            filterSexes,
            filterDiseases,
            filterStatuses,
            filterRationColors,
            ageFilter,
            assignedFilter,
            transferFilter,
        })

    let tableData
    if (isPatientTab) {
        tableData = isPatientTab && usePagination(filteredPatients, rowsPerPage)
    } else {
        let typedData: any[] = []
        if (activeTab === 'hospitals') {
            typedData = (data ?? []) as Hospital[]
        } else if (activeTab === 'doctors' || activeTab === 'ashas' || activeTab === 'nurses') {
            typedData = (data ?? []) as UserDoc[]
        } else if (activeTab === 'patients') {
            typedData = (data ?? []) as Patient[]
        }
        tableData = usePagination(typedData, rowsPerPage)
    }

    const { paginated: paginatedData, currentPage, totalPages, setCurrentPage } = tableData

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
        gpsLocation: p.gpsLocation ? `${p.gpsLocation.lat}, ${p.gpsLocation.lng}` : 'Not available',
        followUps: p.followUps?.length
            ? p.followUps.map((f, i) => `#${i + 1}: ${f.date} - ${f.remarks}`).join(' | ')
            : 'None',
        status: p.status || 'Not specified',
    }))

    return (
        <div className="">
            <PatientToolbar
                isPatientTab={isPatientTab}
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
            />

            <Table className="border-border rounded-md border">
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
                                key={data.id}
                                rowData={data}
                                index={(currentPage - 1) * rowsPerPage + index}
                                onView={(p) => {
                                    setSelectedPatient(p)
                                    setShowView(true)
                                }}
                                onUpdate={(p) => {
                                    setSelectedPatient(p)
                                    setShowUpdate(true)
                                }}
                                onDelete={(p) => setPatientToDelete(p)}
                                headers={headers}
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

            {totalPages > 1 && (
                <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                    {/* Stats Section */}
                    <div className="flex w-full justify-between text-sm font-light md:flex-row">
                        <section className="flex space-x-4">
                            <div className="border px-2 py-1 tracking-wider">
                                Total Patients: {patientStats.total}
                            </div>
                            <div className="border px-2 py-1 tracking-wider">
                                Male: {patientStats.male}
                            </div>
                            <div className="border px-2 py-1 tracking-wider">
                                Female: {patientStats.female}
                            </div>
                            <div className="border px-2 py-1 tracking-wider">
                                Others: {patientStats.others}
                            </div>
                        </section>

                        <section className="flex space-x-4">
                            <div className="border px-2 py-1 tracking-wider">
                                Assigned: {patientStats.assigned}
                            </div>
                            <div className="border px-2 py-1 tracking-wider">
                                Unassigned: {patientStats.unassigned}
                            </div>
                            <div className="border px-2 py-1 tracking-wider">
                                Alive: {patientStats.alive}
                            </div>
                            <div className="border px-2 py-1 tracking-wider">
                                Death: {patientStats.deceased}
                            </div>
                        </section>
                    </div>

                    {/* Pagination UI */}
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                                    }}
                                    className={
                                        currentPage === 1
                                            ? 'pointer-events-none opacity-50'
                                            : undefined
                                    }
                                />
                            </PaginationItem>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <PaginationItem key={page}>
                                    <PaginationLink
                                        href="#"
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
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
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
                    setPatients((prev) => prev.filter((p) => p.id !== deletedId))
                }
            />
        </div>
    )
}
