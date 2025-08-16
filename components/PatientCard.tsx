'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { db } from '@/firebase'
import { doc, updateDoc } from 'firebase/firestore'
import { ChevronDown, ChevronUp, Plus } from 'lucide-react'
import { Patient } from '@/schema/patient'

import { Timestamp } from 'firebase/firestore'
import { toast } from 'sonner'
type FirestoreTimestamp = {
    seconds: number
    nanoseconds: number
    toDate?: () => Date
}
type FirestoreDate = Timestamp | FirestoreTimestamp | string | null | undefined

// 🔒 Type guard
function isFirestoreTimestamp(obj: unknown): obj is Timestamp {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        typeof (obj as { toDate?: unknown }).toDate === 'function'
    )
}

// 🗓️ Safe date formatter
export const formatDate = (date: Date): string => {
    if (!date) return 'No date specified'

    const dateObject = new Date(date)
    const year = dateObject.getFullYear()
    const month = String(dateObject.getMonth() + 1).padStart(2, '0')
    const day = String(dateObject.getDate()).padStart(2, '0')
    return `${day}/${month}/${year}`
}

interface Props {
    patient: Patient
    onChange: (e: React.ChangeEvent<HTMLInputElement>, id: string) => void
    onSave: (id: string) => void
    isSaving: boolean
    onAddFollowUp?: (id: string, remark: string) => void
}

export default function PatientCard({ patient, onChange, onSave, isSaving, onAddFollowUp }: Props) {
    // Guard clause to prevent rendering if patient is not available

    const [open, setOpen] = useState(false)
    const [savingLocation, setSavingLocation] = useState(false)
    const [isAddingFollowUp, setIsAddingFollowUp] = useState(false)
    const [newRemark, setNewRemark] = useState('')

    if (!patient) {
        return null
    }

    const toggle = () => setOpen(!open)

    const handleSaveNewFollowUp = () => {
        if (!newRemark.trim()) {
            toast.warning('Remarks cannot be empty.')
            return
        }
        onAddFollowUp?.(patient.id, newRemark)
        setNewRemark('')
        setIsAddingFollowUp(false)
    }

    const saveLocation = async () => {
        if (!navigator.geolocation) {
            toast.warning('Geolocation is not supported by your browser')
            return
        }
        setSavingLocation(true)
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords
                const patientRef = doc(db, 'patients', patient.id)
                await updateDoc(patientRef, {
                    gpsLocation: { lat: latitude, lng: longitude },
                })
                alert('Location saved successfully!')
                setSavingLocation(false)
                // Avoid full page reload; parent state update is better
                // location.reload()
            },
            (error) => {
                alert('Error getting location')
                console.error(error)
                setSavingLocation(false)
            }
        )
    }

    return (
        <div className="bg-background text-foreground max-w-lg min-w-[300px] rounded-xl border p-4 shadow-md">
            <div
                className="flex cursor-pointer items-center justify-between text-center font-semibold"
                onClick={toggle}
            >
                {patient.name || 'Unnamed Patient'}
                {open ? <ChevronUp /> : <ChevronDown />}
            </div>

            <div
                className={`overflow-hidden transition-all duration-300 ${
                    open ? 'mt-4 max-h-[3000px]' : 'max-h-0'
                }`}
            >
                <Tabs defaultValue="personal" className="w-full">
                    <TabsList className="bg-muted mb-4 w-full justify-around rounded-lg">
                        <TabsTrigger value="personal">🧍 Personal</TabsTrigger>
                        <TabsTrigger value="medical">🏥 Medical</TabsTrigger>
                    </TabsList>

                    {/* Personal Info Tab - RESTORED */}
                    <TabsContent value="personal" className="grid grid-cols-1 gap-3">
                        {(() => {
                            type PatientEditableKey =
                                | 'name'
                                | 'phoneNumber'
                                | 'sex'
                                | 'dob'
                                | 'address'
                                | 'rationCardColor'
                            const fields: { label: string; name: PatientEditableKey }[] = [
                                { label: 'Name', name: 'name' },
                                { label: 'Phone Number', name: 'phoneNumber' },
                                { label: 'Sex', name: 'sex' },
                                { label: 'Date of Birth', name: 'dob' },
                                { label: 'Address', name: 'address' },
                                { label: 'Ration Card Color', name: 'rationCardColor' },
                            ]

                            return fields.map(({ label, name }) => (
                                <div key={name}>
                                    <Label className="text-sm">{label}</Label>
                                    <Input
                                        name={name}
                                        value={(patient[name] as string) || ''}
                                        onChange={(e) => onChange(e, patient.id)}
                                        placeholder={label}
                                    />
                                </div>
                            ))
                        })()}

                        {patient.aadhaarId && (
                            <div>
                                <Label className="text-sm">Aadhaar ID</Label>
                                <p className="text-muted-foreground text-sm">{patient.aadhaarId}</p>
                            </div>
                        )}
                    </TabsContent>

                    {/* Medical Info Tab with Restored Details and New Follow-Up System */}
                    <TabsContent value="medical" className="space-y-4">
                        {/* RESTORED Medical Details */}
                        {patient.assignedHospitalName && (
                            <div>
                                <Label className="text-sm">Assigned Hospital</Label>
                                <p className="text-muted-foreground text-sm">
                                    {patient.assignedHospitalName}
                                </p>
                            </div>
                        )}
                        {patient.assignedAsha && (
                            <div>
                                <Label className="text-sm">Assigned ASHA</Label>
                                <p className="text-muted-foreground text-sm">
                                    {patient.assignedAsha}
                                </p>
                            </div>
                        )}
                        {(patient.diseases?.length ?? 0) > 0 && (
                            <div>
                                <Label className="text-sm">Diseases</Label>
                                <ul className="text-muted-foreground list-inside list-disc text-sm">
                                    {patient.diseases!.map((disease, idx) => (
                                        <li key={idx}>{disease}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* --- NEW Follow-Ups Section --- */}
                        <div className="space-y-3 border-t pt-2">
                            <div className="flex items-center justify-between">
                                <Label className="text-base font-medium">Follow-ups</Label>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setIsAddingFollowUp(!isAddingFollowUp)}
                                >
                                    <Plus className="h-5 w-5" />
                                </Button>
                            </div>
                            {isAddingFollowUp && (
                                <div className="bg-muted/50 space-y-2 rounded-lg border p-3">
                                    <Label htmlFor={`new-remark-${patient.id}`}>
                                        Add New Remark
                                    </Label>
                                    <Textarea
                                        id={`new-remark-${patient.id}`}
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
                                    {(patient.followUps ?? [])
                                        .slice()
                                        .sort((a, b) => {
                                            const dateA = new Date(a?.date ?? 0)
                                            const dateB = new Date(b?.date ?? 0)
                                            return dateB.getTime() - dateA.getTime()
                                        })
                                        .map((followUp, idx) => (
                                            <div
                                                key={idx}
                                                className="border-primary border-l-2 pl-3 text-sm"
                                            >
                                                <p className="text-foreground font-semibold">
                                                    {formatDate(new Date(followUp?.date ?? 0))}
                                                </p>
                                                <p className="text-muted-foreground">
                                                    {followUp?.remarks}
                                                </p>
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

                        {/* RESTORED GPS Section */}
                        <div className="space-y-2 border-t pt-2">
                            <Button
                                className="w-full bg-orange-600 hover:bg-orange-700"
                                onClick={saveLocation}
                                disabled={savingLocation}
                            >
                                {savingLocation ? 'Saving GPS...' : '📍 Save GPS Location'}
                            </Button>
                            {patient.gpsLocation && (
                                <>
                                    <p className="text-muted-foreground text-center text-xs">
                                        Location: {patient.gpsLocation.lat.toFixed(4)},{' '}
                                        {patient.gpsLocation.lng.toFixed(4)}
                                    </p>
                                    <Button
                                        className="w-full bg-blue-600 text-white hover:bg-blue-700"
                                        onClick={() =>
                                            window.open(
                                                `https://maps.google.com/?q=${
                                                    patient.gpsLocation!.lat
                                                },${patient.gpsLocation!.lng}`,
                                                '_blank'
                                            )
                                        }
                                    >
                                        🗺️ View in Google Maps
                                    </Button>
                                </>
                            )}
                        </div>

                        {/* Final Save Button */}
                        <Button
                            className="w-full"
                            onClick={() => onSave(patient.id)}
                            disabled={isSaving}
                        >
                            {isSaving ? 'Saving...' : '💾 Save Changes'}
                        </Button>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
