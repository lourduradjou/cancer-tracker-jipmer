'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
    HOSPITAL_TABLE_HEADERS,
    DOCTOR_TABLE_HEADERS,
    NURSES_TABLE_HEADERS,
    PATIENT_TABLE_HEADERS,
    ASHA_TABLE_HEADERS,
} from '@/constants/data' // adjust the path
import PatientTable from '@/components/table/GenericTable'

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState<
        'hospitals' | 'doctors' | 'nurses' | 'ashas' | 'patients'
    >('patients')

    const headersMap = {
        hospitals: HOSPITAL_TABLE_HEADERS,
        doctors: DOCTOR_TABLE_HEADERS,
        nurses: NURSES_TABLE_HEADERS,
        ashas: ASHA_TABLE_HEADERS,
        patients: PATIENT_TABLE_HEADERS,
    }

    const selectedHeaders = headersMap[activeTab]

    return (
        <div className="mx-auto px-8 py-4 lg:max-w-[1240px] xl:max-w-[1400px]">
            {/* Tabs */}
            <div className="space-x-4">
                {(['hospitals', 'doctors', 'nurses', 'ashas', 'patients'] as const).map((tab) => (
                    <Button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        variant={'simple'}
                        className={activeTab === tab ? 'bg-muted-foreground' : 'bg-border'} // highlight active
                    >
                        <p className="uppercase">{tab}</p>
                    </Button>
                ))}
            </div>

            {/* Content */}
            <div className="p-4">
                <PatientTable headers={selectedHeaders} activeTab={activeTab} />
            </div>
        </div>
    )
}
