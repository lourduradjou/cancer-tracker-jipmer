'use client'

import Loading from '@/components/ui/loading'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import PatientTable from '@/components/PatientTable'
import { useAuth } from '@/contexts/AuthContext'
import { usePatients } from '@/hooks/usePatients'
import { toast } from 'sonner'

export default function NursePage() {
    const router = useRouter()
    const { user, role, orgId, isLoadingAuth } = useAuth()

    useEffect(() => {
        if (!isLoadingAuth && !user) {
            router.push('/login')
            return
        }

        if (role !== 'nurse') {
            let redirectPath = '/login'
            if (role === 'doctor') redirectPath = '/doctor'
            if (role === 'asha') redirectPath = '/asha'
            if (role === 'admin') redirectPath = '/admin'
            toast.warning('You are not allowed to view this page')
            router.push(redirectPath)
        }
    }, [isLoadingAuth, user, role, router])

    //fetch patients if no errors
    const {
        data: patients,
        isLoading: isLoadingPatients,
        isError: isErrorPatients,
        error: patientsError,
    } = usePatients({ orgId, enabled: role === 'nurse' && !!orgId })

    if (isErrorPatients) {
        console.error('Failed to load patients for nurse:', patientsError)
        toast.error('Failed to load patient data for your organization.')
        // Optionally, show a more specific error message or component
    }

    // If still loading auth or if not a nurse (and redirection hasn't completed yet)
    if (isLoadingAuth || role !== 'nurse') {
        return (
            <main className="flex h-screen flex-col items-center justify-center">
                <Loading />
                <p className="mt-4 text-gray-600">
                    {isLoadingAuth ? 'Checking authentication...' : 'Loading your patients...'}
                </p>
            </main>
        )
    }

    return (
        <main className="mx-auto px-8 py-4 lg:max-w-[1240px] xl:max-w-[1400px]">
            <PatientTable
                patients={patients || []}
                setPatients={() => {
                    /* React Query handles updates, direct setPatients is often not needed here */
                }}
            />
        </main>
    )
}
