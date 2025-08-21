import * as XLSX from 'xlsx'
import Papa from 'papaparse'
import { collection, addDoc } from 'firebase/firestore'
import { db } from '@/firebase' // adjust path to your firebase config
import { getCollectionName } from '@/lib/common/getCollectionName'
import { PatientSchema } from '@/schema/patient'
import { HospitalSchema } from '@/schema/hospital'
import { UserSchema } from '@/schema/user'

const schemaMap: Record<string, any> = {
    patients: PatientSchema,
    hospitals: HospitalSchema,
    doctors: UserSchema,
    nurses: UserSchema,
    ashas: UserSchema,
}

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

    e.target.value = '' // reset input so same file can be uploaded again
}

const uploadToFirestore = async (rows: any[], activeTab: string, queryClient: any) => {
  try {
    const collectionName = getCollectionName(activeTab)
    const colRef = collection(db, collectionName)
    const schema = schemaMap[activeTab]

    if (!schema) {
      throw new Error(`No schema defined for activeTab: ${activeTab}`)
    }

    let successCount = 0
    const errors: { row: number; issues: string[]; rowData: any }[] = []

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i]

      const parsed = schema.safeParse(row)
      if (!parsed.success) {
        errors.push({
          row: i + 1, // row number (1-based)
          issues: parsed?.error?.errors?.map((e: any) => `${e.path.join(".")}: ${e.message}`),
          rowData: row, // include original data for fixing
        })
        continue
      }

      await addDoc(colRef, parsed.data) // only save if valid
      successCount++
    }

    if (successCount > 0) {
      alert(`✅ Imported ${successCount} records successfully`)
    }

    if (errors.length > 0) {
      console.error("❌ Validation errors:", errors)
      alert(`⚠️ ${errors.length} rows failed validation. An error report has been downloaded.`)

      // Generate Excel error report
      const errorSheet = XLSX.utils.json_to_sheet(
        errors?.map(err => ({
          Row: err.row,
        //   Issues: err.issues.join("; "),
          ...err.rowData, // include original row fields
        }))
      )
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, errorSheet, "Errors")
      XLSX.writeFile(wb, `import-errors-${activeTab}.xlsx`)
    }

    // Invalidate cache after imports
    queryClient.invalidateQueries({
      queryKey: [collectionName === "users" ? "users" : collectionName],
    })
  } catch (err) {
    console.error("Error uploading data:", err)
    alert(err instanceof Error ? err.message : "Failed to import data.")
  }
}

