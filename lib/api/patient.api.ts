import { db } from '@/firebase'
import { doc, updateDoc } from 'firebase/firestore'
import { PatientFormInputs } from '@/schema/patient'

export const updatePatient = async (patientId: string, data: Partial<PatientFormInputs>) => {
  try {
    const patientRef = doc(db, 'patients', patientId)

    // remove any undefined values (Firestore doesn’t allow them)
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== undefined)
    )

    await updateDoc(patientRef, cleanData)
    return true
  } catch (err) {
    console.error('Failed to update patient', err)
    throw err
  }
}
