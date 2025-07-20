'use client'

import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { updateDoc, doc } from 'firebase/firestore'
import { db } from '@/firebase'
import { Patient } from '@/types/patient'
import { Label } from '@/components/ui/label'

export default function UpdatePatientDialog({
	open,
	onOpenChange,
	patient,
	setPatient,
	setPatients,
}: {
	open: boolean
	onOpenChange: (open: boolean) => void
	patient: Patient
	setPatient: React.Dispatch<React.SetStateAction<Patient | null>>
	setPatients: React.Dispatch<React.SetStateAction<Patient[]>>
}) {
	const handleUpdate = async () => {
		try {
			await updateDoc(doc(db, 'patients', patient.id), {
				name: patient.name,
				phoneNumber: patient.phoneNumber,
				sex: patient.sex,
				dob: patient.dob,
				address: patient.address,
				aadhaarId: patient.aadhaarId,
				rationCardColor: patient.rationCardColor,
				assignedAsha: patient.assignedAsha || '',
				assignedPhc: patient.assignedPhc || '',
				diseases: patient.diseases || [],
				gpsLocation: patient.gpsLocation || { lat: 0, lng: 0 },
			})
			setPatients((prev) => prev.map((p) => (p.id === patient.id ? patient : p)))
			onOpenChange(false)
		} catch (err) {
			console.error('Error updating patient:', err)
			alert('Update failed')
		}
	}

	const handleChange = (field: keyof Patient, value: string) => {
		setPatient((prev) =>
			prev
				? {
						...prev,
						[field]: value,
				  }
				: prev
		)
	}

	const handleDiseasesChange = (value: string) => {
		setPatient((prev) => (prev ? { ...prev, diseases: value.split(',').map((d) => d.trim()) } : prev))
	}

	const handleLocationChange = (axis: 'lat' | 'lng', value: string) => {
		const num = parseFloat(value)
		if (isNaN(num)) return
		setPatient((prev) =>
			prev
				? {
						...prev,
						gpsLocation: {
							...(prev.gpsLocation || {}),
							[axis]: num,
						},
				  }
				: prev
		)
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-4xl">
				<DialogHeader>
					<DialogTitle>Update Patient</DialogTitle>
				</DialogHeader>
				<div className="grid grid-cols-2 gap-6 mt-4">
						{/* LEFT COLUMN */}
						<div className="space-y-4">
							{[
								{ label: 'Name', field: 'name' },
								{ label: 'Phone Number', field: 'phoneNumber' },
								{ label: 'Sex', field: 'sex' },
								{ label: 'DOB', field: 'dob' },
								{ label: 'Address', field: 'address' },
							].map(({ label, field }) => (
								<div key={field}>
									<Label className="mb-1 block">{label}</Label>
									<Input
										value={(patient[field as keyof Patient] as string) || ''}
										onChange={(e) => handleChange(field as keyof Patient, e.target.value)}
										placeholder={label}
									/>
								</div>
							))}
						</div>

					{/* RIGHT COLUMN */}
					<div className="space-y-4">
						{[
							{ label: 'Aadhaar ID', field: 'aadhaarId' },
							{ label: 'Ration Card Color', field: 'rationCardColor' },
							{ label: 'Assigned ASHA', field: 'assignedAsha' },
							{ label: 'Assigned PHC', field: 'assignedPhc' },
						].map(({ label, field }) => (
							<div key={field}>
								<Label className="mb-1 block">{label}</Label>
								<Input
									value={(patient[field as keyof Patient] as string) || ''}
									onChange={(e) => handleChange(field as keyof Patient, e.target.value)}
									placeholder={label}
								/>
							</div>
						))}

						<div>
							<Label className="mb-1 block">Diseases (comma-separated)</Label>
							<Input
								value={(patient.diseases || []).join(', ')}
								onChange={(e) => handleDiseasesChange(e.target.value)}
								placeholder="e.g., Diabetes, Hypertension"
							/>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<Label className="mb-1 block">Latitude</Label>
								<Input
									value={String(patient.gpsLocation?.lat || '')}
									onChange={(e) => handleLocationChange('lat', e.target.value)}
									placeholder="Latitude"
								/>
							</div>
							<div>
								<Label className="mb-1 block">Longitude</Label>
								<Input
									value={String(patient.gpsLocation?.lng || '')}
									onChange={(e) => handleLocationChange('lng', e.target.value)}
									placeholder="Longitude"
								/>
							</div>
						</div>
					</div>
				</div>
				<DialogFooter className="pt-6 w-full">
					<Button onClick={handleUpdate} className='w-full'>Save Changes</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
