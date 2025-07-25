import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

export const exportToCSV = <T extends Record<string, unknown>>(data: T[], fileName: string) => {
	if (!data || data.length === 0) return

	const csvContent = [
		Object.keys(data[0]).join(','), // headers
		...data.map((row) =>
			Object.values(row)
				.map((val) => `"${val}"`)
				.join(',')
		),
	].join('\n')
	const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
	saveAs(blob, `${fileName}.csv`)
}

export const exportToExcel = <T extends Record<string, unknown>>(data: T[], fileName: string) => {
	if (!data || data.length === 0) return

	const worksheet = XLSX.utils.json_to_sheet(data)
	const workbook = XLSX.utils.book_new()
	XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')

	const excelBuffer = XLSX.write(workbook, {
		bookType: 'xlsx',
		type: 'array',
	})

	const dataBlob = new Blob([excelBuffer], {
		type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
	})
	saveAs(dataBlob, `${fileName}.xlsx`)
}
