// hooks/useFilteredPatients.ts
import { usePatientFilterStore } from '@/store/patient-filter-store'
import { Patient } from '@/schema/patient'
import { useMemo } from 'react'

export function useFilteredPatients(patients: Patient[] = []): Patient[] {
    const { filters } = usePatientFilterStore()

    const { searchTerm, sexes, diseases, statuses, rationColors, age, assigned, transfer } = filters

    return useMemo(() => {
        if (!patients.length) return []
        const today = new Date()

        return patients
            .filter((p) => {
                const matchSearch =
                    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    p.phoneNumber?.some((num) => num?.includes(searchTerm))

                const matchSex = sexes.length === 0 || sexes.includes((p.sex || '').toLowerCase())

                const matchDisease =
                    diseases.length === 0 ||
                    p.diseases?.some((d) => diseases.includes(d.toLowerCase()))

                const matchStatus =
                    statuses.length === 0 ||
                    statuses.includes((p.patientStatus || '').toLowerCase())

                const matchRationCard =
                    rationColors.length === 0 ||
                    rationColors.includes((p.rationCardColor || '').toLowerCase())

                const dob = new Date(p.dob || '')
                const ageInYears = isNaN(dob.getTime())
                    ? -1
                    : (today.getTime() - dob.getTime()) / (1000 * 60 * 60 * 24 * 365.25)

                const matchAgeFilter =
                    !age ||
                    (age === 'lt5' && ageInYears < 5) ||
                    (age === 'lt20' && ageInYears < 20) ||
                    (age === 'gt50' && ageInYears > 50)

                const matchAssigned =
                    assigned === ''
                        ? true
                        : assigned === 'assigned'
                          ? !!p.assignedAsha
                          : !p.assignedAsha

                const matchTransferred =
                    transfer === ''
                        ? true
                        : transfer === 'transferred'
                          ? p.transferred === true
                          : p.transferred !== true

                return (
                    matchSearch &&
                    matchSex &&
                    matchDisease &&
                    matchStatus &&
                    matchRationCard &&
                    matchAgeFilter &&
                    matchAssigned &&
                    matchTransferred
                )
            })
            .sort((a, b) => {
                if (
                    a.patientStatus?.toLowerCase() === 'alive' &&
                    b.patientStatus?.toLowerCase() !== 'alive'
                )
                    return -1
                if (
                    a.patientStatus?.toLowerCase() !== 'alive' &&
                    b.patientStatus?.toLowerCase() === 'alive'
                )
                    return 1
                return 0
            })
    }, [patients, searchTerm, sexes, diseases, statuses, rationColors, age, assigned, transfer])
}
