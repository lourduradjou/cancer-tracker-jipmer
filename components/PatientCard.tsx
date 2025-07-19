'use client'

import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '@/firebase'
import { Input } from '@/components/ui/input'

interface Patient {
	id: string
	name: string
	address: string
	phoneNumber: string
	dob: string
	sex: string
	rationCardColor: string
	gpsLocation?: {
		lat: number
		lng: number
	}
	[key: string]: any // allows dynamic fields like name, phoneNumber, etc.
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
					gpsLocation: {
						lat: latitude,
						lng: longitude,
					},
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
		<div className='min-w-[250px] border rounded-xl shadow-md p-3 bg-white'>
			<div
				className='cursor-pointer font-semibold text-blue-700 text-center flex justify-between items-center'
				onClick={toggle}
			>
				{patient.name || 'Unnamed Patient'}
				{open ? <ChevronUp /> : <ChevronDown />}
			</div>

			<div
				className={`transition-all duration-300 overflow-hidden ${
					open ? 'max-h-[1000px] mt-3' : 'max-h-0'
				}`}
			>
				<div className='space-y-2 mt-2'>
					<Input
						name='name'
						placeholder='Patient Name'
						value={patient.name || ''}
						onChange={(e) => onChange(e, patient.id)}
					/>
					<Input
						name='phoneNumber'
						placeholder='Phone Number'
						value={patient.phoneNumber || ''}
						onChange={(e) => onChange(e, patient.id)}
					/>
					<Input
						name='address'
						placeholder='Address'
						value={patient.address || ''}
						onChange={(e) => onChange(e, patient.id)}
					/>
					<Input
						name='dob'
						placeholder='Date of Birth'
						value={patient.dob || ''}
						onChange={(e) => onChange(e, patient.id)}
					/>
					<Input
						name='sex'
						placeholder='Sex'
						value={patient.sex || ''}
						onChange={(e) => onChange(e, patient.id)}
					/>
					<Input
						name='rationCardColor'
						placeholder='Ration Card Color'
						value={patient.rationCardColor || ''}
						onChange={(e) => onChange(e, patient.id)}
					/>

					<Button
						className='w-full'
						onClick={() => onSave(patient.id)}
						disabled={isSaving}
					>
						{isSaving ? 'Saving...' : '💾 Save Changes'}
					</Button>

					<Button
						className='w-full bg-green-600 hover:bg-green-700'
						onClick={saveLocation}
						disabled={savingLocation}
					>
						{savingLocation
							? 'Saving GPS...'
							: '📍 Save GPS Location'}
					</Button>

					{patient.gpsLocation &&
						patient.gpsLocation.lat !== undefined &&
						patient.gpsLocation.lng !== undefined && (
							<>
								<p className='text-xs text-gray-600 text-center'>
									Location:{' '}
									{patient.gpsLocation.lat.toFixed(4)},{' '}
									{patient.gpsLocation.lng.toFixed(4)}
								</p>
								<Button
									className='w-full bg-blue-500 hover:bg-blue-600 text-white'
									onClick={() =>
										window.open(
											`https://www.google.com/maps/search/?api=1&query=${
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
			</div>
		</div>
	)
}
