'use client'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { PatientFormInputs } from '@/schema/patient'

export default function ColumnFive({ form, isEdit }: { form: any; isEdit?: boolean }) {
    const { getValues, setValue } = useFormContext<PatientFormInputs>()
    const patient = getValues()

    const [isAddingFollowUp, setIsAddingFollowUp] = useState(false)
    const [newRemark, setNewRemark] = useState('')
    const [savingLocation, setSavingLocation] = useState(false)

    /** Save new follow-up (optimistic, in form state) */
    const handleSaveNewFollowUp = () => {
        if (!newRemark.trim()) return

        const updatedFollowUps = [
            ...(patient.followUps ?? []),
            { remarks: newRemark, date: new Date().toISOString() },
        ]

        setValue('followUps', updatedFollowUps, { shouldDirty: true })
        setNewRemark('')
        setIsAddingFollowUp(false)
    }

    /** Save GPS locally (optimistic) */
    const handleSaveLocation = async () => {
        setSavingLocation(true)
        try {
            if (!navigator.geolocation) {
                alert('Geolocation is not supported by your browser')
                return
            }
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const coords = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        accuracy: position.coords.accuracy,
                    }

                    // 🔹 Save to form state
                    setValue('gpsLocation', coords, { shouldDirty: true })
                    setSavingLocation(false)
                },
                (err) => {
                    console.error('Error saving location:', err)
                    setSavingLocation(false)
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0,
                }
            )
        } catch (e) {
            console.error(e)
            setSavingLocation(false)
        }
    }

    /** Final Save — parent form will pick it up */

    return (
        <div className="flex max-w-lg flex-col gap-4">
            {/* --- Follow-Ups Section --- */}
            <div className="w-full space-y-3 pt-2">
                <div className="flex items-center space-x-4">
                    <Label className="text-base font-medium">Follow-ups </Label>
                    <Button size="icon" onClick={() => setIsAddingFollowUp(!isAddingFollowUp)}>
                        <Plus className="h-5 w-5" />
                    </Button>
                </div>
                {isAddingFollowUp && (
                    <div className="bg-muted/50 space-y-4 rounded-lg border p-3">
                        <Label htmlFor="new-remark">Add New Remarks / FollowUp Details</Label>
                        <Textarea
                            id="new-remark"
                            placeholder="Enter follow-up details..."
                            value={newRemark}
                            onChange={(e) => setNewRemark(e.target.value)}
                        />
                        <div className="flex justify-end gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsAddingFollowUp(false)}
                            >
                                Cancel
                            </Button>
                            <Button size="sm" onClick={handleSaveNewFollowUp}>
                                Save Follow-up
                            </Button>
                        </div>
                    </div>
                )}
                {(patient.followUps?.length ?? 0) > 0 ? (
                    <div className="max-h-72 space-y-4 overflow-y-auto pr-2">
                        {patient.followUps
                            ?.slice()
                            .sort((a, b) => {
                                const dateA = new Date(a?.date ?? 0)
                                const dateB = new Date(b?.date ?? 0)
                                return dateB.getTime() - dateA.getTime()
                            })
                            .map((followUp, idx) => (
                                <div key={idx} className="border-primary border-l-2 pl-3 text-sm">
                                    <p className="text-muted-foreground">{followUp?.remarks}</p>
                                </div>
                            ))}
                    </div>
                ) : (
                    !isAddingFollowUp && (
                        <p className="text-muted-foreground py-2 text-center text-sm">
                            No follow-ups yet.
                        </p>
                    )
                )}
            </div>

            {/* --- GPS Section --- */}
            <div className="space-y-2 pt-2">
                <Button onClick={handleSaveLocation} disabled={savingLocation}>
                    {savingLocation ? 'Saving GPS...' : 'Save GPS Location'}
                </Button>
                {patient.gpsLocation && (
                    <>
                        <p className="text-muted-foreground text-center text-xs">
                            Location: {patient?.gpsLocation?.lat?.toFixed(4) ?? 'N/A'},{' '}
                            {patient?.gpsLocation?.lng?.toFixed(4) ?? 'N/A'}
                        </p>

                        <Button
                            className="bg-blue-600 text-white hover:bg-blue-700"
                            onClick={() =>
                                window.open(
                                    `https://maps.google.com/?q=${patient.gpsLocation!.lat},${patient.gpsLocation!.lng}`,
                                    '_blank'
                                )
                            }
                        >
                            View in Google Maps
                        </Button>
                    </>
                )}
            </div>
        </div>
    )
}
