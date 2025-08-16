'use client'

import PatientCard from '@/components/PatientCard'
import Loading from '@/components/ui/loading'
import { useAuth } from '@/contexts/AuthContext'
import { db } from '@/firebase'
import { useTableData } from '@/hooks/useTableData'
import { Patient } from '@/schema/patient'
import { useQueryClient } from '@tanstack/react-query'
import { doc, Timestamp, updateDoc } from 'firebase/firestore'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function AshaPage() {
    const router = useRouter()
    const queryClient = useQueryClient()
    const { user, role, isLoadingAuth } = useAuth()

    const [saving, setSaving] = useState(false)

    useEffect(() => {
        if (!isLoadingAuth) {
            if (!user) {
                router.push('/login')
                return
            }
            if (role !== 'asha') {
                let redirectPath = '/login'
                if (role === 'doctor') redirectPath = '/doctor'
                else if (role === 'nurse') redirectPath = '/nurse'
                toast.warning('You are not allowed to view this page')
                router.push(redirectPath)
            }
        }
    }, [isLoadingAuth, user, role, router])

    const {
        data: patients,
        isLoading: isLoadingPatients,
        isError: isErrorPatients,
        error: patientsError,
    } = useTableData({ ashaEmail: user?.email || null, enabled: role === 'asha' })

    // Handle input change in PatientCard
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, patientId: string) => {
        const { name, value } = e.target
        // When using React Query, you typically update the cached data directly
        queryClient.setQueryData(
            ['patients', { ashaEmail: user?.email }],
            (oldPatients: Patient[] | undefined) =>
                oldPatients?.map((p) => (p.id === patientId ? { ...p, [name]: value } : p)) || []
        )
    }

    const handleAddFollowUp = async (patientId: string, remark: string) => {
        const now = Timestamp.now()
        // const newFollowUp: FollowUp = {
        //     date: now,
        //     remarks: remark,
        // }

        try {
            setSaving(true)
            const patientDocRef = doc(db, 'patients', patientId)

            const currentPatientsInCache = queryClient.getQueryData<Patient[]>([
                'patients',
                { ashaEmail: user?.email },
            ])

            // Ensure currentPatientsInCache is an array before finding
            const currentPatient = currentPatientsInCache?.find((p: Patient) => p.id === patientId)

            if (!currentPatient) {
                // Handle case where patient is not found in cache (e.g., fetch it explicitly if needed)
                // For now, let's throw an error or handle gracefully
                toast.error('Patient not found in local data. Please refresh.')
                return
            }

            // const updatedFollowUps = [...(currentPatient?.followUps || []), newFollowUp]
            const updatedFollowUps = [...(currentPatient?.followUps || [])]

            await updateDoc(patientDocRef, {
                followUps: updatedFollowUps,
            })

            // Optimistic update + Invalidate to re-fetch fresh data
            queryClient.setQueryData(
                ['patients', { ashaEmail: user?.email }],
                (oldPatients: Patient[] | undefined) =>
                    oldPatients?.map((p) =>
                        p.id === patientId ? { ...p, followUps: updatedFollowUps } : p
                    ) || []
            )
            toast.success('Follow-up added successfully!')
        } catch (error) {
            console.error('Error adding follow-up:', error)
            toast.error('Failed to add follow-up.')
        } finally {
            setSaving(false)
        }
    }

    const handleSave = async (patientId: string) => {
        setSaving(true)
        try {
            const patient = patients?.find((p) => p.id === patientId)
            if (!patient) throw new Error('Patient not found in cache.')

            const { id, ...patientData } = patient
            const docRef = doc(db, 'patients', patientId)

            await updateDoc(docRef, patientData)
            toast.success('Patient updated successfully.')
        } catch (error) {
            console.error('Error updating patient:', error)
            toast.error('Failed to update patient.')
        } finally {
            setSaving(false)
        }
    }

    const showLoading = isLoadingAuth || isLoadingPatients
    if (isErrorPatients) {
        console.error('Failed to load patients for asha:', patientsError)
        toast.error('Failed to load patient data.')
        // Optionally, show a more specific error message or component
    }

    // If still loading auth or if not an ASHA (and redirection hasn't completed yet)
    if (showLoading || role !== 'asha') {
        return (
            <main className="flex h-screen items-center justify-center">
                <Loading />
                <p className="text-gray-500">
                    {isLoadingAuth ? 'Checking authentication...' : 'Loading your patients...'}
                </p>
            </main>
        )
    }

    // Render UI
    return (
        <main className="mt-4 p-4">
            <h1 className="mb-4 text-center text-xl font-bold">Your Assigned Patients</h1>

            {patients?.length === 0 ? (
                <p className="text-center text-sm">No patients assigned to you.</p>
            ) : (
                <div className="mx-auto flex max-w-[1400px] flex-col items-center gap-4 overflow-auto md:flex-row">
                    {patients?.map((patient) => (
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
