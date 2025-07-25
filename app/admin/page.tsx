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

export default function AdminPage() {
	const router = useRouter()
	const [checking, setChecking] = useState(true)
	const [patients, setPatients] = useState<Patient[]>([])

	useEffect(() => {
		let didRedirect = false

		const unsub = onAuthStateChanged(auth, async (user) => {
			console.log(user)
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

			const doctorData = snap.docs[0].data()
			const role = doctorData.role
			console.log('role' + role)
			if (role !== 'admin') {
				if (role === 'nurse') {
					router.push('/nurse')
				} else if (role === 'asha') {
					router.push('/asha')
				} else if (role === 'doctor') {
					router.push('/doctor')
				} else router.push('/login')
				toast.warning('You are not allowed to view this page')
				return
			}

			const orgId = doctorData.orgId

			const patientsQuery = query(collection(db, 'patients'))

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
		<div className='px-8 py-4 lg:max-w-[1240px] mx-auto xl:max-w-[1400px]'>
			<PatientTable patients={patients} setPatients={setPatients} />
		</div>
	)
}
