'use client'
import WelcomeBanner from '@/components/dashboard/WelcomeBanner'
import { withAuth } from '@/components/hoc/withAuth'
import PatientFormMobile from '@/components/asha/PatientFormMobile'
import Loading from '@/components/ui/loading'
import { SearchInput } from '@/components/search/SearchInput'
import { ROLE_CONFIG } from '@/constants/auth'
import { useAuth } from '@/contexts/AuthContext'
import { useTableSearch } from '@/hooks/table/useTableSearch'
import { useTableData } from '@/hooks/table/useTableData'
import { Patient } from '@/schema/patient'
import { toast } from 'sonner'
import { useMemo } from 'react'

function AshaPageContent() {
    const { user, userId, orgName, isLoadingAuth } = useAuth()

    // 🔹 Build queryProps like the doctor page
    const queryProps = {
        orgId: null,
        ashaId: userId,
        enabled: !isLoadingAuth && !!user?.email,
        requiredData: 'patients' as const,
    }
    const {
        data: patients = [],
        isLoading,
        isError,
    } = (useTableData(queryProps) ?? {}) as {
        data: Patient[]
        isLoading: boolean
        isError: boolean
    }

    const { 
        filteredRows: searchedPatients, 
        searchTerm, 
        setSearchTerm, 
        isSearching, 
        isSearchActive, 
    } = useTableSearch({ 
        rows: patients, 
        activeTab: 'patients', 
        scope: { orgId: null, ashaId: userId }, 
    }) 

    const patientsToDisplay = useMemo(() => searchedPatients, [searchedPatients]) 

    if (isLoading || isLoadingAuth) {
        return (
            <main className="flex h-screen items-center justify-center">
                <Loading />
                <p className="text-gray-500">Loading your patients...</p>
            </main>
        )
    }

    if (isError) {
        toast.error('Failed to load patient data. Try again.')
        return (
            <main className="flex h-screen items-center justify-center text-red-500">
                <p>An error occurred while fetching data.</p>
            </main>
        )
    }

    return (
    <main className="mt-4 p-4">

        <div className="mb-4 flex justify-end">
            <WelcomeBanner />
        </div>

        <div className="mb-4 flex justify-center">
            <div className="w-full max-w-md">
                <SearchInput
                    value={searchTerm}
                    onChange={setSearchTerm}
                    placeholder="Search patients..."
                    isSearching={isSearching}
                />
            </div>
        </div>

        <h1 className="mb-1 text-center text-xl font-bold">
            Your Assigned Patients
        </h1>
        {orgName && (
            <p className="mb-4 text-center text-sm text-zinc-500 dark:text-zinc-400">{orgName}</p>
        )}

        {patientsToDisplay.length === 0 ? (
            <p className="text-center text-sm">
                No patients assigned to you.
            </p>
        ) : (
            <div className="mx-auto flex flex-col items-center gap-4 overflow-auto">
                {patientsToDisplay.map((patient: Patient) => (
                    <PatientFormMobile
                        key={patient.id}
                        patient={patient}
                    />
                ))}
            </div>
        )}
    </main>
)
}

export default withAuth(AshaPageContent, ROLE_CONFIG.asha)
