// hooks/usePatientStats.ts
import { Patient } from '@/types/patient'
import { useMemo } from 'react'

export function usePatientStats(patients: Patient[]) {
	return useMemo(() => {
		let stats = {
			total: 0,
			assigned: 0,
			unassigned: 0,
			male: 0,
			female: 0,
			others: 0,
			alive: 0,
			deceased: 0,
		}

		patients.forEach((p) => {
			stats.total++

			if (p.assignedAsha) stats.assigned++
			else stats.unassigned++

			switch ((p.sex || '').toLowerCase()) {
				case 'male':
					stats.male++
					break
				case 'female':
					stats.female++
					break
				default:
					stats.others++
			}

			if ((p.status || '').toLowerCase() === 'alive') stats.alive++
			else if ((p.status || '').toLowerCase() === 'death')
				stats.deceased++
		})

		return stats
	}, [patients])
}
