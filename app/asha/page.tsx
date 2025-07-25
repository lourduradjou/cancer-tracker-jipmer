'use client'

import PatientCard from '@/components/PatientCard'
import { db } from '@/firebase'
import { FollowUp, Patient } from '@/types/patient' // Import FollowUp type
import { doc, Timestamp, updateDoc } from 'firebase/firestore'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function AshaPage() {
	const router = useRouter()
	const [checking] = useState(true)
	const [ashaEmail] = useState('')
	const [patients, setPatients] = useState<Patient[]>([])
	const [saving, setSaving] = useState(false)

	// The useEffect for auth and fetching patients remains the same...
	useEffect(() => {
		// ... no changes needed in this useEffect
	}, [router])

	useEffect(() => {
		// ... no changes needed in this useEffect
	}, [ashaEmail])

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		patientId: string
	) => {
		const { name, value } = e.target
		setPatients((prev) =>
			prev.map((p) => (p.id === patientId ? { ...p, [name]: value } : p))
		)
	}

	// ✨ STEP 1: Create the handler for adding a new follow-up
	const handleAddFollowUp = async (patientId: string, remark: string) => {
		const now = Timestamp.now()
		const newFollowUp: FollowUp = {
			date: {
				type: 'firestore/timestamp/1.0',
				seconds: now.seconds,
				nanoseconds: now.nanoseconds,
			},
			remarks: remark,
			// You can add other fields like who added it
			// allotedAsha: ashaEmail,
		}

		try {
			const patientDocRef = doc(db, 'patients', patientId)
			const patientToUpdate = patients.find((p) => p.id === patientId)
			const updatedFollowUps = [
				...(patientToUpdate?.followUps || []),
				newFollowUp,
			]

			// Update only the followUps field in Firestore
			await updateDoc(patientDocRef, {
				followUps: updatedFollowUps,
			})

			// Update local state to show the change immediately
			setPatients((prev) =>
				prev.map((p) =>
					p.id === patientId
						? { ...p, followUps: updatedFollowUps }
						: p
				)
			)

			toast.success('Follow-up added successfully!')
		} catch (error) {
			console.error('Error adding follow-up:', error)
			toast.error('Failed to add follow-up.')
		}
	}

	const handleSave = async (patientId: string) => {
		setSaving(true)
		try {
			const patient = patients.find((p) => p.id === patientId)
			if (!patient) throw new Error('Patient not found')

			const { id, ...patientData } = patient
			const docRef = doc(db, 'patients', patientId)

			await updateDoc(docRef, patientData)
			toast.success('Patient updated successfully.')
		} catch (error) {
			console.error('Error updating patient:', error)
			toast.error('Failed to update patient.')
		}
		setSaving(false)
	}

	if (checking) {
		// ... no changes to the loading state
	}

	return (
		<main className='p-4 mt-4'>
			<h1 className='text-xl font-bold text-center mb-4'>
				Your Assigned Patients
			</h1>

			{patients.length === 0 ? (
				<p className='text-center text-gray-500 text-sm'>
					No patients assigned to you.
				</p>
			) : (
				<div className='flex flex-col overflow-y-auto space-y-4 pb-4 w-full items-center'>
					{patients.map((patient) => (
						<PatientCard
							key={patient.id}
							patient={patient}
							onChange={handleInputChange}
							onSave={handleSave}
							isSaving={saving}
							onAddFollowUp={handleAddFollowUp}
						/>
					))}
				</div>
			)}
		</main>
	)
}
