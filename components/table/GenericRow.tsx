'use client'
import { Eye, Pencil, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { TableCell, TableRow } from '@/components/ui/table'
import { db } from '@/firebase'
import { dobToAgeUtil } from '@/lib/patient/dobToAge'
import { doc, updateDoc } from 'firebase/firestore'
import { usePathname } from 'next/navigation'
import { memo } from 'react'
import { toast } from 'sonner'
import TransferDialog from '../dialogs/TransferDialog'
import DiseasesCell from './DiseasesCell'
import PhoneCell from './PhoneCell'
import StatusCell from './StatusCell'

type Header = {
    name: string
    key: string
}

type RowDataBase = {
    id: string
    name?: string
    phoneNumber?: string[]
    contactNumber?: string[]
    dob?: string
    diseases?: string[]
    status?: string
    [key: string]: unknown
}

import type { Patient } from '@/schema/patient' // adjust the import path as needed

type GenericRowProps<RowDataType extends RowDataBase> = {
    isPatientTab: boolean
    rowData: any
    index: number
    onView: (data: RowDataType) => void
    onUpdate: (data: RowDataType) => void
    onDelete: (data: RowDataType) => void
    headers: Header[]
}

const GenericRow = memo(function GenericRow<RowDataType extends RowDataBase>(
    props: GenericRowProps<RowDataType>
) {
    const { isPatientTab, rowData, index, onView, onUpdate, onDelete, headers } = props
    const pathname = usePathname()
    const isNurse = pathname.startsWith('/nurse')

    const renderCellContent = (key: string) => {
        switch (key) {
            case 'phoneNumber':
            case 'contactNumber':
                return <PhoneCell phoneNumbers={(rowData[key] as string[]) ?? []} />

            case 'dob':
                return <span className="">{getAge(rowData[key])}</span>

            case 'diseases':
                return <DiseasesCell diseases={rowData[key] as string[]} />

            case 'status':
                return <StatusCell status={rowData[key] as string} />

            default:
                return <span className="">{String(rowData[key])}</span>
        }
    }

    const getAge = (dob: string | undefined): string => dobToAgeUtil(dob)

    return (
        <TableRow key={rowData.id} className="border-border border-b font-light">
            <TableCell className="border-border border-r text-center">{index + 1}</TableCell>
            {headers.map((header) => (
                <TableCell
                    key={String(header.key)}
                    className={`border-border border-r text-center ${header.key === 'name' ? 'font-semibold' : ''}`}
                >
                    {renderCellContent(header.key)}
                </TableCell>
            ))}
            <TableCell className="space-x-2 text-center">
                {/* view button */}

                <Button size="icon" variant="outline" onClick={() => onView(rowData)} title="View">
                    <Eye className="h-4 w-4" />
                </Button>

                {/* update button */}

                <Button
                    size="icon"
                    variant="outline"
                    onClick={() => onUpdate(rowData)}
                    title="Update"
                >
                    <Pencil className="h-4 w-4" />
                </Button>

                {/* transfer button */}
                {isPatientTab && (
                    <TransferDialog
                        patient={rowData as unknown as Patient}
                        onTransfer={async (hospitalId) => {
                            try {
                                if (!rowData.id) throw new Error('Missing patient document ID')
                                const patientRef = doc(db, 'patients', rowData.id)
                                await updateDoc(patientRef, {
                                    assignedPhc: hospitalId,
                                    assignedAsha: '',
                                })

                                toast.success(`Transferred ${rowData.name} to new PHC.`)
                            } catch (err) {
                                toast.error('Transfer failed. See console for details.' + err)
                            }
                        }}
                    />
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
