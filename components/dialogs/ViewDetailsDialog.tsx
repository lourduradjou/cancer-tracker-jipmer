'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Patient } from '@/schema/patient'
import { UserDoc } from '@/schema/user'
import { Hospital } from '@/schema/hospital'

// Create a generic type that can be any of your data types
type RowDataType = Patient | UserDoc | Hospital

// Define a type for the fields to display
type FieldToDisplay = { label: string; key: string };

// Update the props to be generic and include fieldsToDisplay
export default function ViewDetailsDialog({
    open,
    onOpenChange,
    rowData,
    fieldsToDisplay,
}: {
    open: boolean
    onOpenChange: (open: boolean) => void
    // Use the generic type here
    rowData: RowDataType
    fieldsToDisplay: FieldToDisplay[]
}) {
    // Helper function to render specific data types
    const renderValue = (key: string, value: any) => {
        if (key === 'phoneNumber' && Array.isArray(value)) {
            return value.join(', ')
        }
        if (key === 'gpsLocation' && value) {
            return `Lat: ${value.lat}, Lng: ${value.lng}`
        }
        // Add more special cases here if needed (e.g., date formatting, nested objects)
        return value || 'N/A'
    }
    // function displayDetail(rowData) {
    //     console.log('inside display fucntion')
    //     for(let key of fieldsToDisplay) {
    //         console.log(key.label + ' ' + 'of' + ' ' + rowData[key.key])
    //     }
    // }
    // displayDetail(rowData)

    console.log('fields to display' + fieldsToDisplay)
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-card text-card-foreground max-w-3xl rounded-xl shadow-md">
                <DialogHeader>
                    {/* Make the title dynamic based on the data */}
                    <DialogTitle className="text-lg font-semibold">
                        Details of {rowData['name']}
                    </DialogTitle>
                </DialogHeader>
                <ScrollArea className="max-h-[70vh] pr-2">
                    <div className="grid gap-6 text-sm md:grid-cols-2">
                        {/* Dynamically render the fields */}
                        {fieldsToDisplay.map(({ label, key }) => (
                            <Info
                                key={key as string}
                                label={label}
                                value={renderValue(key, rowData[key as keyof typeof rowData])}
                            />
                        ))}
                    </div>
                    {/* Follow-ups section can be a conditional render */}
                    {'followUps' in rowData && (rowData.followUps?.length ?? 0) > 0 && (
                        <div className="md:col-span-2">
                            <p className="mt-4 font-semibold">Follow Ups:</p>
                            <ul className="mt-2 space-y-3">
                                {rowData.followUps?.map((f, i) => (
                                    <li
                                        key={i}
                                        className="border-border bg-muted/20 rounded-lg border p-3"
                                    >
                                        {/* <Info
                                            label="Date"
                                            value={
                                                typeof f.date === 'object' && f.date !== null && 'seconds' in f.date
                                                    ? new Date(f.date.seconds * 1000).toLocaleDateString()
                                                    : new Date(f.date).toLocaleDateString()
                                            }
                                        /> */}
                                        <Info label="Remarks" value={f?.remarks ?? 'No remarks'} />
                                        {/* Add more info from follow-up if needed */}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}

function Info({ label, value }: { label: string; value?: string | number }) {
    return (
        <p>
            <span className="text-muted-foreground font-medium">{label}:</span>{' '}
            <span>{value || 'N/A'}</span>
        </p>
    )
}
