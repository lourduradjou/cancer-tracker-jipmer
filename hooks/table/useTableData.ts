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
    adminRequiredData?:
        | 'ashas'
        | 'doctors'
        | 'nurses'
        | 'hospitals'
        | 'patients'
        | 'removedPatients'
        | undefined
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

    // Now you return the appropriate query result based on the props.
    if (adminRequiredData === 'hospitals') {
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
        return hospitalsQuery
    }
    if (
        adminRequiredData === 'ashas' ||
        adminRequiredData === 'doctors' ||
        adminRequiredData === 'nurses'
    ) {
        const usersQuery = useQuery<UserDoc[], Error>({
            queryKey: ['users', adminRequiredData],
            queryFn: async () => {
                const usersQuery = query(
                    collection(db, 'users'),
                    where('role', '==', cutLastCharacter(adminRequiredData))
                )
                const usersSnap = await getDocs(usersQuery)
                return usersSnap.docs.map((user) => ({
                    id: user.id, // Firestore document ID
                    ...(user.data() as Omit<UserDoc, 'id'>), // spread the rest of the user fields
                })) as UserDoc[]
            },
            enabled: isUsersEnabled,
            staleTime: 60 * 1000,
        })
        return usersQuery
    }

    if (adminRequiredData === 'patients') {
        let queryKeyValue
        if (orgId) {
            queryKeyValue = ['patients', { orgId }]
        } else if (ashaEmail) {
            queryKeyValue = ['patients', { ashaEmail }]
        } else {
            queryKeyValue = ['patients']
        }

        const patientsQuery = useQuery<Patient[], Error>({
            queryKey: queryKeyValue,

            queryFn: async () => {
                let patientsQuery
                if (orgId) {
                    patientsQuery = query(
                        collection(db, 'patients'),
                        where('assignedHospital.id', '==', orgId)
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
        return patientsQuery
    }

    if (adminRequiredData === 'removedPatients') {
        let queryKeyValue

        queryKeyValue = ['removedPatients']

        const patientsQuery = useQuery<Patient[], Error>({
            queryKey: queryKeyValue,

            queryFn: async () => {
                let removedPatientsQuery

                removedPatientsQuery = query(collection(db, 'removedPatients'))

                const removedPatientsSnap = await getDocs(removedPatientsQuery)
                return removedPatientsSnap.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as Patient[]
            },
            staleTime: 60 * 1000,
        })
        return patientsQuery
    }
}
