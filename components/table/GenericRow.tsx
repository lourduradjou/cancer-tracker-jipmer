// components/GenericRow.tsx
'use client'
import { Eye, Pencil, Trash2, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TableCell, TableRow } from '@/components/ui/table'
import { db } from '@/firebase'
import { dobToAgeUtil } from '@/lib/patient/dobToAge'
import { deleteDoc, doc, setDoc, updateDoc } from 'firebase/firestore'
import { usePathname } from 'next/navigation'
import { memo } from 'react'
import { toast } from 'sonner'
import TransferDialog from '../dialogs/TransferDialog'
import DiseasesCell from './DiseasesCell'
import PhoneCell from './PhoneCell'
import StatusCell from './StatusCell'
import type { Patient } from '@/schema/patient'
import GenericPatientDialog from '../forms/patient/GenericPatientDialog'
import { useQueryClient } from '@tanstack/react-query'
import { formatDobToDDMMYYYY } from '@/lib/patient/dateFormatter'

type Header = {
    name: string
    key: string
}

// Make RowDataBase more flexible to accept any object with an id
type RowDataBase = {
    id: string | number
    [key: string]: unknown
}

type GenericRowProps = {
    isPatientTab: boolean
    isRemovedPatientsTab?: boolean
    rowData: RowDataBase
    index: number
    onView: (data: RowDataBase) => void
    onUpdate: (data: RowDataBase) => void
    onDelete: (data: RowDataBase) => void
    headers: Header[]
}

const GenericRow = memo(function GenericRow(props: GenericRowProps) {
    const {
        isPatientTab,
        rowData,
        isRemovedPatientsTab,
        index,
        onView,
        onUpdate,
        onDelete,
        headers,
    } = props
    const pathname = usePathname()
    const isNurse = pathname.startsWith('/nurse')
    const queryClient = useQueryClient()

    const renderCellContent = (key: string) => {
        const value = rowData[key]

        switch (key) {
            case 'phoneNumber':
            case 'contactNumber':
                return <PhoneCell phoneNumbers={value as string[]} isPatientTab={isPatientTab} />

            case 'dob':
                return (
                    <span className="">{dobToAgeUtil(formatDobToDDMMYYYY(value as string))}</span>
                )

            case 'diseases':
                return <DiseasesCell diseases={(value as string[]) ?? []} />

            case 'patientStatus':
                return <StatusCell status={value as string} />

            default:
                return <span className="">{String(value)}</span>
        }
    }

    const handleRetrieve = async () => {
        try {
            if (!rowData.id) throw new Error('Missing patient ID')

            const patientId = rowData.id.toString()

            // move patient back to "patients"
            await setDoc(doc(db, 'patients', patientId), {
                ...rowData,
                restoredAt: new Date().toISOString(),
            })

            // delete from "removedPatients"
            await deleteDoc(doc(db, 'removedPatients', patientId))

            queryClient.invalidateQueries({ queryKey: ['patients'] })
            queryClient.invalidateQueries({ queryKey: ['removedPatients'] })

            toast.success(`Patient ${rowData.name} retrieved successfully!`)
        } catch (err) {
            toast.error('Failed to retrieve patient. Check console.')
            console.error(err)
        }
    }

    return (
        <TableRow key={rowData.id} className="border-border border-b font-light">
            <TableCell className="border-border border-r text-center">{index + 1}</TableCell>
            {headers.map((header, index) => (
                <TableCell
                    key={index}
                    className={`border-border border-r text-center ${header.key === 'name' ? 'font-semibold' : ''}`}
                >
                    {renderCellContent(header.key)}
                </TableCell>
            ))}
            <TableCell className="space-x-2 text-center">
                <Button size="icon" variant="outline" onClick={() => onView(rowData)} title="View">
                    <Eye className="h-4 w-4" />
                </Button>

                {isPatientTab && (
                    <GenericPatientDialog
                        mode="edit"
                        patientData={rowData as Patient}
                        trigger={
                            <Button size="icon" variant="outline" title="Update">
                                <Pencil className="h-4 w-4" />
                            </Button>
                        }
                        onSuccess={() => {
                            console.log('Patient updated successfully')
                        }}
                    />
                )}

                {isPatientTab && (
                    <TransferDialog
                        patient={rowData as Patient}
                        onTransfer={async (hospitalId, hospitalName) => {
                            try {
                                if (!rowData.id) throw new Error('Missing patient document ID')
                                const patientRef = doc(db, 'patients', rowData.id.toString())
                                await updateDoc(patientRef, {
                                    assignedHospital: { id: hospitalId, name: hospitalName },
                                    assignedAsha: '',
                                })
                                toast.success(`Transferred ${rowData.name} to new PHC.`)
                            } catch (err) {
                                toast.error('Transfer failed. See console for details.' + err)
                            }
                        }}
                    />
                )}

                {isRemovedPatientsTab && (
                    <Button
                        size="icon"
                        variant="outline"
                        className="text-green-600"
                        onClick={handleRetrieve}
                        title="Retrieve Patient"
                    >
                        <RotateCcw className="h-4 w-4" />
                    </Button>
                )}
                <Button
                    size="icon"
                    variant="destructive"
                    className="text-white"
                    onClick={() => onDelete(rowData)}
                    title="Delete Record"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </TableCell>
        </TableRow>
    )
})

export default GenericRow
