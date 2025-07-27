import { db } from '@/firebase'
import { Patient } from '@/types/patient'
import { useQuery } from '@tanstack/react-query'
import { collection, getDocs, query, where } from 'firebase/firestore'

type UsePatientsProps = {
    orgId?: string | null
    ashaEmail?: string | null
    enabled?: boolean
}

export const usePatients = ({ orgId, ashaEmail, enabled = true }: UsePatientsProps) => {
    return useQuery<Patient[], Error>({
        queryKey: ['patients', { orgId, ashaEmail }],
        queryFn: async () => {
            let patientsQuery
            if (orgId) {
                //for doctors and nurse fetch their respective patients via orgId
                patientsQuery = query(collection(db, 'patients'), where('assignedPhc', '==', orgId))
            } else if (ashaEmail) {
                patientsQuery = query(
                    collection(db, 'patients'),
                    where('assignedAsha', '==', ashaEmail)
                )
            } else {
                throw new Error('No organization Id or Asha email provided to fetch patients')
            }

            const patientsSnap = await getDocs(patientsQuery)
            return patientsSnap.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Patient[]
        },
        enabled: enabled && (!!orgId || !!ashaEmail),
        staleTime: 60 * 1000, // Data considered fresh for 1 minute
    })
}
