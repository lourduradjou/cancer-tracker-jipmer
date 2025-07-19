'use client'

import Loading from '@/components/ui/loading'
import { auth, db } from '@/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import PatientTable from '@/components/PatientTable'
import { Patient } from '@/types/patient'
import { toast } from 'sonner'

export default function DoctorPage() {
	const router = useRouter()
	const [checking, setChecking] = useState(true)
	const [patients, setPatients] = useState<Patient[]>([])

	useEffect(() => {
		let didRedirect = false

		const unsub = onAuthStateChanged(auth, async (user) => {
			if (!user) {
				didRedirect = true
				router.push('/login')
				return
			}

			const q = query(
				collection(db, 'users'),
				where('email', '==', user.email!.trim().toLowerCase())
			)
			const snap = await getDocs(q)

			if (snap.empty) {
				didRedirect = true
				router.push('/login')
				return
			}

			const nurseData = snap.docs[0].data()
			const role = nurseData.role
			console.log('role' + role)
			if (role !== 'nurse') {
				if (role === 'doctor') {
					router.push('/doctor')
					toast.warning('You are not allowed to view this page')
				} else if (role === 'asha') {
					router.push('/asha')
					toast.warning('You are not allowed to view this page')
				} else router.push('/login')
				return
			}

			const orgId = nurseData.orgId

			const patientsQuery = query(
				collection(db, 'patients'),
				where('assignedPhc', '==', orgId)
			)

			const patientsSnap = await getDocs(patientsQuery)

			const patientList: Patient[] = patientsSnap.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			})) as Patient[]

			setPatients(patientList)
			if (!didRedirect) setChecking(false)
		})

		return () => unsub()
	}, [router])

	if (checking) {
		return (
			<main className='flex flex-col items-center justify-center h-screen'>
				<Loading />
				<p className='text-gray-600 mt-4'>Loading your patients...</p>
			</main>
		)
	}

	return (
		<div className='p-8 lg:max-w-[1240px] mx-auto xl:max-w-[1400px]'>
			<PatientTable patients={patients} setPatients={setPatients} />
		</div>
	)
}
