'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '@/firebase'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
	Tabs,
	TabsList,
	TabsTrigger,
	TabsContent,
} from '@/components/ui/tabs'

interface FollowUp {
	date: any
	remarks: string
}

interface Patient {
	id: string
	name: string
	address: string
	phoneNumber: string
	dob: string
	sex: string
	rationCardColor: string
	aadhaarId?: string
	assignedPhc?: string
	assignedAsha?: string
	diseases?: string[]
	followUps?: FollowUp[]
	gpsLocation?: {
		lat: number
		lng: number
	}
	[key: string]: any
}

interface Props {
	patient: Patient
	onChange: (e: React.ChangeEvent<HTMLInputElement>, id: string) => void
	onSave: (id: string) => void
	isSaving: boolean
}

export default function PatientCard({
	patient,
	onChange,
	onSave,
	isSaving,
}: Props) {
	const [open, setOpen] = useState(false)
	const [savingLocation, setSavingLocation] = useState(false)

	const toggle = () => setOpen(!open)

	const saveLocation = async () => {
		if (!navigator.geolocation) {
			alert('Geolocation is not supported by your browser')
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
				location.reload()
			},
			(error) => {
				alert('Error getting location')
				console.error(error)
				setSavingLocation(false)
			}
		)
	}

	return (
		<div className="min-w-[300px] max-w-lg border rounded-xl shadow-md p-4 bg-background text-foreground">
			<div
				className="cursor-pointer font-semibold text-center flex justify-between items-center"
				onClick={toggle}
			>
				{patient.name || 'Unnamed Patient'}
				{open ? <ChevronUp /> : <ChevronDown />}
			</div>

			<div
				className={`transition-all duration-300 overflow-hidden ${
					open ? 'max-h-[3000px] mt-4' : 'max-h-0'
				}`}
			>
				<Tabs defaultValue="personal" className="w-full">
					<TabsList className="w-full justify-around mb-4 bg-muted rounded-lg">
						<TabsTrigger value="personal">🧍 Personal</TabsTrigger>
						<TabsTrigger value="medical">🏥 Medical</TabsTrigger>
					</TabsList>

					<TabsContent value="personal" className="grid grid-cols-1 gap-3">
						{[
							{ label: 'Name', name: 'name' },
							{ label: 'Phone Number', name: 'phoneNumber' },
							{ label: 'Sex', name: 'sex' },
							{ label: 'Date of Birth', name: 'dob' },
							{ label: 'Address', name: 'address' },
							{ label: 'Ration Card Color', name: 'rationCardColor' },
						].map(({ label, name }) => (
							<div key={name}>
								<Label className="text-sm">{label}</Label>
								<Input
									name={name}
									value={patient[name] || ''}
									onChange={(e) => onChange(e, patient.id)}
									placeholder={label}
								/>
							</div>
						))}

						{patient.aadhaarId && (
							<div>
								<Label className="text-sm">Aadhaar ID</Label>
								<p className="text-sm text-muted-foreground">
									{patient.aadhaarId}
								</p>
							</div>
						)}
					</TabsContent>

					<TabsContent value="medical" className="space-y-4">
						{patient.assignedPhc && (
							<div>
								<Label className="text-sm">Assigned PHC</Label>
								<p className="text-sm text-muted-foreground">
									{patient.assignedPhc}
								</p>
							</div>
						)}

						{patient.assignedAsha && (
							<div>
								<Label className="text-sm">Assigned ASHA</Label>
								<p className="text-sm text-muted-foreground">
									{patient.assignedAsha}
								</p>
							</div>
						)}

						{patient.diseases?.length > 0 && (
							<div>
								<Label className="text-sm">Diseases</Label>
								<ul className="list-disc list-inside text-sm text-muted-foreground">
									{patient.diseases.map((disease, idx) => (
										<li key={idx}>{disease}</li>
									))}
								</ul>
							</div>
						)}

						{patient.followUps?.length > 0 && (
							<div>
								<Label className="text-sm">Follow Ups</Label>
								<ul className="space-y-1 text-sm text-muted-foreground">
									{patient.followUps.map((followUp, idx) => (
										<li key={idx} className="border-b pb-1">
											<p>
												<strong>Date:</strong>{' '}
												{new Date(
													followUp.date?.toDate?.() ||
														followUp.date
												).toLocaleString()}
											</p>
											<p>
												<strong>Remarks:</strong>{' '}
												{followUp.remarks}
											</p>
										</li>
									))}
								</ul>
							</div>
						)}

						{/* GPS Button + Info + Link */}
						<Button
							className="w-full bg-orange-600 hover:bg-orange-700"
							onClick={saveLocation}
							disabled={savingLocation}
						>
							{savingLocation ? 'Saving GPS...' : '📍 Save GPS Location'}
						</Button>

						{patient.gpsLocation && (
							<>
								<p className="text-xs text-center text-muted-foreground">
									Location: {patient.gpsLocation.lat.toFixed(4)},{' '}
									{patient.gpsLocation.lng.toFixed(4)}
								</p>
								<Button
									className="w-full bg-blue-600 hover:bg-blue-700 text-white"
									onClick={() =>
										window.open(
											`https://www.google.com/maps/search/?api=1&query=${patient.gpsLocation.lat},${patient.gpsLocation.lng}`,
											'_blank'
										)
									}
								>
									🗺️ View in Google Maps
								</Button>
							</>
						)}

						{/* Save Button */}
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
