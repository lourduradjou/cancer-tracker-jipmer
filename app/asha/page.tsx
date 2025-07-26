'use client'

import PatientCard from '@/components/PatientCard'
import { db, auth } from '@/firebase'
import { FollowUp, Patient } from '@/types/patient'
import {
	doc,
	Timestamp,
	updateDoc,
	collection,
	getDocs,
	query,
	where,
} from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function AshaPage() {
	const router = useRouter()
	const [checking, setChecking] = useState(true)
	const [ashaEmail, setAshaEmail] = useState('')
	const [patients, setPatients] = useState<Patient[]>([])
	const [saving, setSaving] = useState(false)

	// STEP 1: Auth listener and setting Asha email
	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (user) {
				setAshaEmail(user.email || '')
				setChecking(false)
			} else {
				router.push('/') // Redirect to login if not authenticated
			}
		})
		return () => unsubscribe()
	}, [router])

	// STEP 2: Fetch patients assigned to the ASHA
	useEffect(() => {
		const fetchPatients = async () => {
			try {
				if (!ashaEmail) return

				const patientsRef = collection(db, 'patients')
				const q = query(
					patientsRef,
					where('assignedAsha', '==', ashaEmail)
				)
				const querySnapshot = await getDocs(q)

				const patientsData: Patient[] = []
				querySnapshot.forEach((docSnap) => {
					patientsData.push({
						id: docSnap.id,
						...docSnap.data(),
					} as Patient)
				})

				setPatients(patientsData)
			} catch (error) {
				console.error('Error fetching patients:', error)
				toast.error('Failed to fetch patients.')
			}
		}

		fetchPatients()
	}, [ashaEmail])

	// Handle input change in PatientCard
	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		patientId: string
	) => {
		const { name, value } = e.target
		setPatients((prev) =>
			prev.map((p) => (p.id === patientId ? { ...p, [name]: value } : p))
		)
	}

	// Add a new follow-up to the selected patient
	const handleAddFollowUp = async (patientId: string, remark: string) => {
		const now = Timestamp.now()
		const newFollowUp: FollowUp = {
			date: {
				type: 'firestore/timestamp/1.0',
				seconds: now.seconds,
				nanoseconds: now.nanoseconds,
			},
			remarks: remark,
			// Optional: allotedAsha: ashaEmail
		}

		try {
			const patientDocRef = doc(db, 'patients', patientId)
			const patientToUpdate = patients.find((p) => p.id === patientId)
			const updatedFollowUps = [
				...(patientToUpdate?.followUps || []),
				newFollowUp,
			]

			await updateDoc(patientDocRef, {
				followUps: updatedFollowUps,
			})

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

	// Save edited patient info
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

	// Show loading screen while checking auth
	if (checking) {
		return (
			<main className='flex items-center justify-center h-screen'>
				<p className='text-gray-500'>Checking authentication...</p>
			</main>
		)
	}

	// Render UI
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
