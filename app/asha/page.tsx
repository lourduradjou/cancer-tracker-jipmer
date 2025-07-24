'use client'

import PatientCard from '@/components/PatientCard'
import Loading from '@/components/ui/loading'
import { auth, db } from '@/firebase'
import { Patient } from '@/types/patient'
import { onAuthStateChanged } from 'firebase/auth'
import {
	collection,
	doc,
	getDocs,
	query,
	updateDoc,
	where,
} from 'firebase/firestore'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function AshaPage() {
	const router = useRouter()
	const [checking, setChecking] = useState(true)
	const [ashaEmail, setAshaEmail] = useState('')
	const [patients, setPatients] = useState<Patient[]>([])
	const [saving, setSaving] = useState(false)

	useEffect(() => {
		const unsub = onAuthStateChanged(auth, async (user) => {
			if (!user) {
				router.push('/login')
				return
			}

			const q = query(
				collection(db, 'users'),
				where('email', '==', user.email!.trim().toLowerCase())
			)
			const snap = await getDocs(q)

			if (snap.empty) {
				router.push('/login')
				return
			}

			const userData = snap.docs[0].data()
			const role = userData.role

			if (role !== 'asha') {
				if (role === 'nurse') {
					router.push('/nurse')
					toast.warning('You are not allowed to view this page')
				} else if (role === 'doctor') {
					router.push('/doctor')
					toast.warning('You are not allowed to view this page')
				} else router.push('/login')
				return
			}

			setAshaEmail(user.email!)
			setChecking(false)
		})

		return () => unsub()
	}, [router])

	useEffect(() => {
		if (!ashaEmail) return

		const fetchPatients = async () => {
			const q = query(
				collection(db, 'patients'),
				where('assignedAsha', '==', ashaEmail)
			)
			const snap = await getDocs(q)
			const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
			setPatients(data)
		}

		fetchPatients()
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

	const handleSave = async (patientId: string) => {
		setSaving(true)
		try {
			const patient = patients.find((p) => p.id === patientId)
			const docRef = doc(db, 'patients', patientId)
			await updateDoc(docRef, patient)
			alert('✅ Patient updated successfully.')
		} catch (error) {
			console.error('Error updating patient:', error)
			alert('❌ Failed to update patient.')
		}
		setSaving(false)
	}

	if (checking) {
		return (
			<main className='flex flex-col items-center justify-center h-screen'>
				<Loading />
				<p className='text-gray-600 mt-4'>Verifying your access...</p>
			</main>
		)
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
				<div className='flex overflow-x-auto space-x-4 pb-4 w-full justify-center'>
					{patients.map((patient) => (
						<PatientCard
							key={patient.id}
							patient={patient}
							onChange={handleInputChange}
							onSave={handleSave}
							isSaving={saving}
						/>
					))}
				</div>
			)}
		</main>
	)
}
