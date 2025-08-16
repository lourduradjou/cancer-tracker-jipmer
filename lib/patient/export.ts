import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

export const exportToCSV = <T extends Record<string, unknown>>(data: T[], fileName: string) => {
    if (!data?.length) return

    const escapeValue = (val: unknown) => {
        if (val === null || val === undefined) return ''
        const str = String(val).replace(/"/g, '""') // Escape double quotes
        return `"${str}"`
    }

    const headers = Object.keys(data[0]).join(',')
    const rows = data.map((row) => Object.values(row).map(escapeValue).join(','))
    const csvContent = [headers, ...rows].join('\n')

    // Add UTF-8 BOM for Excel compatibility
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
    saveAs(blob, `${fileName}.csv`)
}

export const exportToExcel = <T extends Record<string, unknown>>(
    data: T[],
    fileName: string,
    sheetName = 'Sheet1'
) => {
    if (!data?.length) return

    const worksheet = XLSX.utils.json_to_sheet(data)

    // Auto column width
    const colWidths = Object.keys(data[0]).map((key) => ({
        wch: Math.max(key.length, ...data.map((row) => String(row[key] || '').length)),
    }))
    worksheet['!cols'] = colWidths

    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
    const blob = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })
    saveAs(blob, `${fileName}.xlsx`)
}
