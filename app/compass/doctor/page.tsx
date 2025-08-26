'use client'

import { GenericTable } from '@/components/table'
import { PATIENT_TABLE_HEADERS } from '@/constants/headers'
import { withAuth } from '@/components/hoc/withAuth'
import { ROLE_CONFIG } from '@/constants/auth'

function DoctorPageContent() {
    return (
        <main className="mx-auto px-8 py-4 lg:max-w-[1240px] xl:max-w-[1400px]">
            <GenericTable headers={PATIENT_TABLE_HEADERS} activeTab="patients" />
        </main>
    )
}

export default withAuth(DoctorPageContent, ROLE_CONFIG.doctor)
