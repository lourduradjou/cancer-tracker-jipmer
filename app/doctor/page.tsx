'use client'

import Loading from '@/components/ui/loading'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import PatientTable from '@/components/table/GenericTable'
import { useAuth } from '@/contexts/AuthContext'
// import { useTableData } from '@/hooks/useTableData'
import { toast } from 'sonner'
import { PATIENT_TABLE_HEADERS } from '@/constants/data'

export default function DoctorPage() {
    const router = useRouter()
    const { user, role, orgId, isLoadingAuth } = useAuth()

    useEffect(() => {
        if (!isLoadingAuth && !user) {
            router.push('/login')
            return
        }

        if (role !== 'doctor') {
            let redirectPath = '/login'
            if (role === 'nurse') redirectPath = '/nurse'
            if (role === 'asha') redirectPath = '/asha'
            if (role === 'admin') redirectPath = '/admin'
            toast.warning('You are not allowed to view this page')
            router.push(redirectPath)
        }
    }, [isLoadingAuth, user, role, router])

    // //fetch patients if no errors
    // const {
    //     data: patients,
    //     isLoading: isLoadingPatients,
    //     isError: isErrorPatients,
    //     error: patientsError,
    // } = useTableData({ orgId, enabled: role === 'doctor' && !!orgId })

    // if (isErrorPatients) {
    //     console.error('Failed to load patients for doctor:', patientsError)
    //     toast.error('Failed to load patient data for your organization.')
    //     // Optionally, show a more specific error message or component
    // }

    // If still loading auth or if not a doctor (and redirection hasn't completed yet)
    if (isLoadingAuth || role !== 'doctor') {
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
            <PatientTable headers={PATIENT_TABLE_HEADERS} activeTab="patients" />
        </main>
    )
}
