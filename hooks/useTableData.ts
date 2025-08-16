import { db } from '@/firebase'
import { Patient } from '@/schema/patient'
import { Hospital } from '@/schema/hospital'
import { UserDoc } from '@/schema/user'
import { useQuery } from '@tanstack/react-query'
import { collection, getDocs, query, where } from 'firebase/firestore'

/**
 * Removes the last character from a string.
 * @param {string} str The input string.
 * @returns {string} The string with the last character removed.
 */
function cutLastCharacter(str: string | undefined): string | undefined {
    // Use the slice method to get a substring from the beginning up to the second-to-last character.
    return str?.slice(0, -1)
}

type UsePatientsProps = {
    orgId?: string | null
    ashaEmail?: string | null | undefined
    enabled?: boolean
    adminRequiredData?: 'ashas' | 'doctors' | 'nurses' | 'hospitals' | 'patients' | undefined
}

export const useTableData = ({
    orgId,
    ashaEmail,
    enabled = true,
    adminRequiredData,
}: UsePatientsProps) => {
    console.log('inside custom user hook')
    const isPatientsEnabled = adminRequiredData ? true : enabled && (!!orgId || !!ashaEmail)
    const isHospitalsEnabled = enabled && adminRequiredData === 'hospitals'
    const isUsersEnabled =
        enabled &&
        (adminRequiredData === 'ashas' ||
            adminRequiredData === 'doctors' ||
            adminRequiredData === 'nurses')

    const patientsQuery = useQuery<Patient[], Error>({
        queryKey: ['patients', { orgId, ashaEmail }],

        queryFn: async () => {
            let patientsQuery
            if (orgId) {
                patientsQuery = query(
                    collection(db, 'patients'),
                    where('assignedHospitalId', '==', orgId)
                )
            } else if (ashaEmail) {
                patientsQuery = query(
                    collection(db, 'patients'),
                    where('assignedAsha', '==', ashaEmail)
                )
            } else if (adminRequiredData === 'patients') {
                patientsQuery = query(collection(db, 'patients'))
            } else {
                throw new Error('No organization Id or Asha email provided to fetch patients')
            }
            const patientsSnap = await getDocs(patientsQuery)
            return patientsSnap.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Patient[]
        },
        enabled: isPatientsEnabled,
        staleTime: 60 * 1000,
    })

    const hospitalsQuery = useQuery<Hospital[], Error>({
        queryKey: ['hospitals'],
        queryFn: async () => {
            const hospitalQuery = query(collection(db, 'hospitals'))
            const hospitalsSnap = await getDocs(hospitalQuery)
            return hospitalsSnap.docs.map((hos) => ({
                id: hos.id,
                ...hos.data(),
            })) as Hospital[]
        },
        enabled: isHospitalsEnabled,
        staleTime: 60 * 1000,
    })

    const usersQuery = useQuery<UserDoc[], Error>({
        queryKey: ['users', adminRequiredData],
        queryFn: async () => {
            const usersQuery = query(
                collection(db, 'users'),
                where('role', '==', cutLastCharacter(adminRequiredData))
            )
            const usersSnap = await getDocs(usersQuery)
            return usersSnap.docs.map((user) => ({
                ...(user.data() as UserDoc),
            })) as UserDoc[]
        },
        enabled: isUsersEnabled,
        staleTime: 60 * 1000,
    })

    // Now you return the appropriate query result based on the props.
    if (adminRequiredData === 'hospitals') {
        return hospitalsQuery
    }
    if (
        adminRequiredData === 'ashas' ||
        adminRequiredData === 'doctors' ||
        adminRequiredData === 'nurses'
    ) {
        return usersQuery
    }
    // Default return for patients
    return patientsQuery
}
