'use client'

import Loading from '@/components/ui/loading'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import PatientTable from '@/components/table/GenericTable'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'
import { PATIENT_TABLE_HEADERS } from '@/constants/headers'

export default function NursePage() {
    const router = useRouter()
    const { user, role, isLoadingAuth } = useAuth()

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
            <PatientTable headers={PATIENT_TABLE_HEADERS} activeTab="patients" />
        </main>
    )
}
