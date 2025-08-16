'use client'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
    HOSPITAL_TABLE_HEADERS,
    DOCTOR_TABLE_HEADERS,
    NURSES_TABLE_HEADERS,
    PATIENT_TABLE_HEADERS,
    ASHA_TABLE_HEADERS,
} from '@/constants/headers'
import PatientTable from '@/components/table/GenericTable'

const TAB_KEY = 'adminPageActiveTab' // key in localStorage

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState<
        'hospitals' | 'doctors' | 'nurses' | 'ashas' | 'patients'
    >('hospitals')

    // Load last active tab from localStorage on mount
    useEffect(() => {
        const storedTab = localStorage.getItem(TAB_KEY) as
            | 'hospitals'
            | 'doctors'
            | 'nurses'
            | 'ashas'
            | 'patients'
            | null
        if (storedTab) setActiveTab(storedTab)
    }, [])

    // Save active tab to localStorage whenever it changes
    const handleTabChange = (tab: typeof activeTab) => {
        setActiveTab(tab)
        localStorage.setItem(TAB_KEY, tab)
    }

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
                {(['hospitals', 'doctors', 'nurses', 'ashas', 'patients'] as const).map(
                    (tab) => (
                        <Button
                            key={tab}
                            onClick={() => handleTabChange(tab)}
                            variant={'simple'}
                            className={
                                activeTab === tab ? 'bg-muted-foreground' : 'bg-border'
                            }
                        >
                            <p className="uppercase">{tab}</p>
                        </Button>
                    )
                )}
            </div>

            {/* Content */}
            <div className="p-4">
                <PatientTable headers={selectedHeaders} activeTab={activeTab} />
            </div>
        </div>
    )
}
