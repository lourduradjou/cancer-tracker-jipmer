// hooks/useFilteredPatients.ts
import { Patient } from '@/types/patient'
import { useMemo } from 'react'

export function useFilteredPatients(
	patients: Patient[],
	{
		searchTerm,
		filterSexes,
		filterDiseases,
		filterStatuses,
		filterRationColors,
		ageFilter,
		assignedFilter,
		transferFilter,
	}: {
		searchTerm: string
		filterSexes: string[]
		filterDiseases: string[]
		filterStatuses: string[]
		filterRationColors: string[]
		ageFilter: string | null
		assignedFilter: 'assigned' | 'unassigned' | ''
		transferFilter: 'transferred' | 'not_transferred' | ''
	}
): Patient[] {
	return useMemo(() => {
		const today = new Date()

		return patients
			.filter((p) => {
				const matchSearch =
					p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
					p.phoneNumber?.some((num) => num.includes(searchTerm))

				const matchSex =
					filterSexes.length === 0 ||
					filterSexes.includes(p.sex?.toLowerCase())

				const matchDisease =
					filterDiseases.length === 0 ||
					p.diseases?.some((d) =>
						filterDiseases.includes(d.toLowerCase())
					)

				const matchStatus =
					filterStatuses.length === 0 ||
					filterStatuses.includes(p.status?.toLowerCase())

				const matchRationCard =
					filterRationColors.length === 0 ||
					filterRationColors.includes(p.rationCardColor?.toLowerCase())

				const dob = new Date(p.dob || '')
				const ageInYears = isNaN(dob.getTime())
					? -1
					: (today.getTime() - dob.getTime()) /
					  (1000 * 60 * 60 * 24 * 365.25)

				const matchAgeFilter =
					!ageFilter ||
					(ageFilter === 'lt5' && ageInYears < 5) ||
					(ageFilter === 'lt20' && ageInYears < 20) ||
					(ageFilter === 'gt50' && ageInYears > 50)

				const matchAssigned =
					assignedFilter === ''
						? true
						: assignedFilter === 'assigned'
						? !!p.assignedAsha
						: !p.assignedAsha

				const matchTransferred =
					transferFilter === ''
						? true
						: transferFilter === 'transferred'
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
					a.status?.toLowerCase() === 'alive' &&
					b.status?.toLowerCase() !== 'alive'
				)
					return -1
				if (
					a.status?.toLowerCase() !== 'alive' &&
					b.status?.toLowerCase() === 'alive'
				)
					return 1
				return 0
			})
	}, [
		patients,
		searchTerm,
		filterSexes,
		filterDiseases,
		filterStatuses,
		filterRationColors,
		ageFilter,
		assignedFilter,
		transferFilter,
	])
}
