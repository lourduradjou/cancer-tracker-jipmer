import * as XLSX from 'xlsx'
import Papa from 'papaparse'
import { collection, addDoc, getDocs } from 'firebase/firestore'
import { db } from '@/firebase'
import { getCollectionName } from '@/lib/common/getCollectionName'
import { PatientSchema } from '@/schema/patient'
import { HospitalSchema } from '@/schema/hospital'
import { UserSchema } from '@/schema/user'

// Map of activeTab -> schema
const schemaMap: Record<string, any> = {
  patients: PatientSchema,
  hospitals: HospitalSchema,
  doctors: UserSchema,
  nurses: UserSchema,
  ashas: UserSchema,
}

/**
 * Import handler (file input)
 */
export const importData = async (
  e: React.ChangeEvent<HTMLInputElement>,
  activeTab: string,
  queryClient: any
) => {
  const file = e.target.files?.[0]
  if (!file) return

  const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls')

  if (isExcel) {
    const data = await file.arrayBuffer()
    const workbook = XLSX.read(data)
    const sheet = workbook.Sheets[workbook.SheetNames[0]]
    const json = XLSX.utils.sheet_to_json(sheet)
    await uploadToFirestore(json, activeTab, queryClient)
  } else {
    Papa.parse(file, {
      header: true,
      complete: async (results) => {
        await uploadToFirestore(results.data as any[], activeTab, queryClient)
      },
    })
  }

  e.target.value = '' // reset input
}

/**
 * Preprocess a single patient row to match PatientSchema
 */
const preprocessPatientRow = async (row: any, hospitalMap: Record<string, { id: string, name: string }>) => {
  const cleaned: any = {}

  // Basic fields
  cleaned.name = row.name?.trim() ?? ''
  cleaned.caregiverName = row.caregiverName ?? ''
  cleaned.sex = (row.sex ?? '').toLowerCase()
  cleaned.address = row.address ?? ''

  // Phone numbers (comma separated → array)
  cleaned.phoneNumber = row.phoneNumber
    ? String(row.phoneNumber).split(',').map((p) => p.trim())
    : []

  // Handle dob or age
  if (row.dob) {
    cleaned.dob = row.dob
  } else if (row.age) {
    const currentYear = new Date().getFullYear()
    cleaned.dob = `${currentYear - Number(row.age)}-01-01` // approx DOB
  }

  // Hospital mapping (Excel may have "hospitalName")
  const hospitalName = row.hospitalName?.trim()
  if (hospitalName && hospitalMap[hospitalName]) {
    cleaned.assignedHospital = hospitalMap[hospitalName]
  }

  // Insurance (Excel columns insuranceType, insuranceId)
  if (row.insuranceType && row.insuranceType !== 'none') {
    cleaned.insurance = {
      type: row.insuranceType,
      id: row.insuranceId ?? '',
    }
  } else {
    cleaned.insurance = { type: 'none' }
  }

  // Booleans
  cleaned.hasAadhaar = String(row.hasAadhaar).toLowerCase() === 'yes'
  cleaned.suspectedCase = String(row.suspectedCase).toLowerCase() === 'yes'

  // Arrays
  cleaned.diseases = row.diseases ? String(row.diseases).split(',').map((d) => d.trim()) : []

  // Copy over optional fields directly
  Object.assign(cleaned, {
    aabhaId: row.aabhaId ?? '',
    aadhaarId: row.aadhaarId ?? '',
    bloodGroup: row.bloodGroup ?? '',
    religion: row.religion ?? '',
    patientStatus: row.patientStatus ?? 'Alive',
    treatmentStatus: row.treatmentStatus ?? 'Ongoing',
    diagnosedDate: row.diagnosedDate ?? '',
    diagnosedYearsAgo: row.diagnosedYearsAgo ?? '',
    hospitalRegistrationDate: row.hospitalRegistrationDate ?? '',
    treatmentStartDate: row.treatmentStartDate ?? '',
    treatmentEndDate: row.treatmentEndDate ?? '',
    biopsyNumber: row.biopsyNumber ?? '',
    transferred: row.transferred === 'yes',
    transferredFrom: row.transferredFrom ?? '',
    hbcrID: row.hbcrID ?? '',
    hospitalRegistrationId: row.hospitalRegistrationId ?? '',
    stageOfTheCancer: row.stageOfTheCancer ?? '',
    reasonOfRemoval: row.reasonOfRemoval ?? '',
    treatmentDetails: row.treatmentDetails ?? '',
    otherTreatmentDetails: row.otherTreatmentDetails ?? '',
  })

  return cleaned
}

/**
 * Upload rows to Firestore with schema validation
 */
const uploadToFirestore = async (rows: any[], activeTab: string, queryClient: any) => {
  try {
    const collectionName = getCollectionName(activeTab)
    const colRef = collection(db, collectionName)
    const schema = schemaMap[activeTab]

    if (!schema) throw new Error(`No schema defined for activeTab: ${activeTab}`)

    // Fetch hospitals for mapping (only if patients import)
    let hospitalMap: Record<string, { id: string; name: string }> = {}
    if (activeTab === 'patients') {
      const snap = await getDocs(collection(db, 'hospitals'))
      snap.forEach((doc) => {
        const data = doc.data()
        hospitalMap[data.name] = { id: doc.id, name: data.name }
      })
    }

    let successCount = 0
    const errors: { row: number; issues: string[]; rowData: any }[] = []

    for (let i = 0; i < rows.length; i++) {
      let row = rows[i]

      // Preprocess if patient
      if (activeTab === 'patients') {
        row = await preprocessPatientRow(row, hospitalMap)
      }

      const parsed = schema.safeParse(row)
      if (!parsed.success) {
        errors.push({
          row: i + 1,
          issues: parsed.error.errors.map((e: any) => `${e.path.join('.')}: ${e.message}`),
          rowData: row,
        })
        continue
      }

      await addDoc(colRef, parsed.data)
      successCount++
    }

    if (successCount > 0) {
      alert(`✅ Imported ${successCount} records successfully`)
    }

    if (errors.length > 0) {
      console.error('❌ Validation errors:', errors)
      alert(`⚠️ ${errors.length} rows failed validation. An error report has been downloaded.`)

      const errorSheet = XLSX.utils.json_to_sheet(
        errors.map((err) => ({
          Row: err.row,
          Issues: err.issues.join('; '),
          ...err.rowData,
        }))
      )
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, errorSheet, 'Errors')
      XLSX.writeFile(wb, `import-errors-${activeTab}.xlsx`)
    }

    queryClient.invalidateQueries({
      queryKey: [collectionName === 'users' ? 'users' : collectionName],
    })
  } catch (err) {
    console.error('Error uploading data:', err)
    alert(err instanceof Error ? err.message : 'Failed to import data.')
  }
}
