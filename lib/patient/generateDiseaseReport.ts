import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

type DiseaseStats = {
    [disease: string]: {
        male: number[]
        female: number[]
        total: number[]
    }
}

const getAgeGroupIndex = (age: number) => {
    if (age < 5) return 0
    if (age < 10) return 1
    if (age < 20) return 2
    if (age < 30) return 3
    if (age < 40) return 4
    if (age < 50) return 5
    if (age < 60) return 6
    return 7
}

export type PatientData = {
    id: string
    name: string
    phoneNumber?: string[]
    sex: string
    dob: string
    address: string
    aadhaarId: string
    rationCardColor: string
    // Changed this line: diseases is a single string
    diseases: string
    assignedPhc: string
    assignedAsha: string
    gpsLocation: string
    followUps: string
    status: string
}

export function generateDiseasePDF(patients: PatientData[]) {
    const doc = new jsPDF()
    const ageGroups = ['<5', '<10', '<20', '<30', '<40', '<50', '<60', '60+']
    const diseaseStats: DiseaseStats = {}

    patients.forEach((p) => {
        // Essential check for required fields
        if (!p.diseases || !p.dob || !p.sex) {
            console.warn(
                `Skipping patient ${p.name} due to missing data: diseases=${p.diseases}, dob=${p.dob}, sex=${p.sex}`
            )
            return
        }

        const birthYear = new Date(p.dob).getFullYear()
        // Use the current year at the time of execution
        const currentYear = new Date().getFullYear()

        const age = currentYear - birthYear
        const ageIndex = getAgeGroupIndex(age)

        // --- CORE CHANGE HERE ---
        // Split the comma-separated string into an array of individual diseases
        // .split(',') creates an array of strings
        // .map(d => d.trim()) removes leading/trailing whitespace from each disease name
        // .filter(d => d !== '') removes any empty strings that might result from extra commas (e.g., "disease1,,disease2")
        const individualDiseases = p.diseases
            .split(',')
            .map((d) => d.trim())
            .filter((d) => d !== '')

        individualDiseases.forEach((disease) => {
            // Ensure the disease name is not empty after trimming/filtering
            if (!disease) return

            if (!diseaseStats[disease]) {
                diseaseStats[disease] = {
                    male: Array(8).fill(0),
                    female: Array(8).fill(0),
                    total: Array(8).fill(0),
                }
            }

            if (p.sex.toLowerCase() === 'male') {
                diseaseStats[disease].male[ageIndex]++
            } else if (p.sex.toLowerCase() === 'female') {
                diseaseStats[disease].female[ageIndex]++
            }
            diseaseStats[disease].total[ageIndex]++
        })
    })

    const columns = [
        'Disease',
        ...ageGroups.map((g) => `M ${g}`),
        ...ageGroups.map((g) => `F ${g}`),
        ...ageGroups.map((g) => `T ${g}`),
    ]

    const data = Object.entries(diseaseStats).map(([disease, counts]) => {
        return [disease, ...counts.male, ...counts.female, ...counts.total]
    })

    doc.text('Disease Distribution Report', 14, 16)
    autoTable(doc, {
        head: [columns],
        body: data,
        startY: 20,
        styles: { fontSize: 6 },
        headStyles: { fillColor: [0, 122, 255] },
        margin: { horizontal: 10 },
    })
    const currentDate = new Date().getDate()
    doc.save(`Disease_Report_${currentDate}.pdf`)
}
