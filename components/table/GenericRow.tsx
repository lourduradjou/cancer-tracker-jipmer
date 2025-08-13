'use client'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Eye, Pencil, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { TableCell, TableRow } from '@/components/ui/table'
import { db } from '@/firebase'
import { Patient } from '@/types/patient'
import { doc, updateDoc } from 'firebase/firestore'
import { usePathname } from 'next/navigation'
import { toast } from 'sonner'
import PhoneCell from './PhoneCell'
import TransferDialog from '../dialogs/TransferDialog'
import { dobToAgeUtil } from '@/lib/patient/dobToAge'
import { UserDoc } from '@/types/user'
import DiseasesCell from './DiseasesCell'
import StatusCell from './StatusCell'

type Header = {
    name: string
    key: string
}

export default function GenericRow<RowDataType>({
    isPatientTab,
    rowData,
    index,
    onView,
    onUpdate,
    onDelete,
    headers,
}: {
    isPatientTab: boolean
    rowData: RowDataType
    index: number
    onView: (patient: Patient) => void
    onUpdate: (patient: Patient) => void
    onDelete: (patient: Patient) => void
    headers: Header[]
}) {
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
        <TableRow className="border-border border-b font-light">
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
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button size="icon" variant="outline" onClick={() => onView(patient)}>
                                <Eye className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>View</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button size="icon" variant="outline" onClick={() => onUpdate(rowData)}>
                                <Pencil className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Update</TooltipContent>
                    </Tooltip>
                    {isPatientTab && (
                        <TransferDialog
                            rowData={rowData}
                            onTransfer={async (phc) => {
                                try {
                                    if (!rowData.id) throw new Error('Missing patient document ID')
                                    const patientRef = doc(db, 'patients', rowData.id)
                                    await updateDoc(patientRef, {
                                        assignedPhc: phc,
                                        assignedAsha: '',
                                    })

                                    toast.success(`Transferred ${rowData.name} to new PHC.`)
                                } catch (err) {
                                    toast.error('Transfer failed. See console for details.' + err)
                                }
                            }}
                        />
                    )}

                    {!isNurse && (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    size="icon"
                                    variant="destructive"
                                    className="text-white"
                                    onClick={() => onDelete(rowData)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Delete</TooltipContent>
                        </Tooltip>
                    )}
                </TooltipProvider>
            </TableCell>
        </TableRow>
    )
}
