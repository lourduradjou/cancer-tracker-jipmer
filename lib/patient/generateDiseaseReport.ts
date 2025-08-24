import { Patient } from '@/schema/patient'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

type DiseaseStats = {
    [disease: string]: {
        male: number[]
        female: number[]
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

export function generateDiseasePDF(patients: Patient[]) {
    const doc = new jsPDF()
    const ageGroups = ['<5', '<10', '<20', '<30', '<40', '<50', '<60', '60+']
    const diseaseStats: DiseaseStats = {}

    patients.forEach((p) => {
        if (!p.diseases || !p.dob || !p.sex) return

        const birthYear = new Date(p.dob).getFullYear()
        const currentYear = new Date().getFullYear()
        const age = currentYear - birthYear
        const ageIndex = getAgeGroupIndex(age)

        const individualDiseases = p.diseases
        individualDiseases.forEach((disease) => {
            if (!disease) return

            if (!diseaseStats[disease]) {
                diseaseStats[disease] = {
                    male: Array(8).fill(0),
                    female: Array(8).fill(0),
                }
            }

            if (p.sex.toLowerCase() === 'male') {
                diseaseStats[disease].male[ageIndex]++
            } else if (p.sex.toLowerCase() === 'female') {
                diseaseStats[disease].female[ageIndex]++
            }
        })
    })

    const columns = [
        'Disease',
        ...ageGroups.map((g) => `M ${g}`),
        ...ageGroups.map((g) => `F ${g}`),
        'Total Male',
        'Total Female',
        'Total',
    ]

    const data = Object.entries(diseaseStats).map(([disease, counts]) => {
        const totalMale = counts.male.reduce((a, b) => a + b, 0)
        const totalFemale = counts.female.reduce((a, b) => a + b, 0)
        const grandTotal = totalMale + totalFemale

        return [disease, ...counts.male, ...counts.female, totalMale, totalFemale, grandTotal]
    })

    doc.text('Disease Distribution Report', 14, 16)

    autoTable(doc, {
        head: [columns],
        body: data,
        startY: 20,
        styles: {
            fontSize: 6,
            lineColor: [220, 220, 220], // light gray borders
            lineWidth: 0.05,
        },
        headStyles: {
            fillColor: [0, 122, 255], // default blue
            textColor: 255,
        },
        didParseCell: (data) => {
            // Female columns pink
            if (data.section === 'head') {
                const femaleStart = 1 + ageGroups.length // after M cols
                const femaleEnd = femaleStart + ageGroups.length - 1

                if (data.column.index >= femaleStart && data.column.index <= femaleEnd) {
                    data.cell.styles.fillColor = [255, 182, 193] // light pink
                    data.cell.styles.textColor = [0, 0, 0]
                }

                // Total Male / Female / Total → light gray highlight
                if (data.column.index >= femaleEnd + 1) {
                    data.cell.styles.fillColor = [240, 240, 240]
                    data.cell.styles.textColor = [0, 0, 0]
                }
            }
        },
        margin: { horizontal: 10 },
    })

    const currentDate = new Date().getDate()
    doc.save(`Disease_Report_${currentDate}.pdf`)
}
