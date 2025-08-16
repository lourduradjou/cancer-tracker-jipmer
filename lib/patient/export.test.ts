// exportUtils.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { exportToCSV, exportToExcel } from './export'
import { saveAs } from 'file-saver'

vi.mock('file-saver', () => ({
    saveAs: vi.fn(),
}))

describe('export utils', () => {
    const data = [
        { name: 'Alice', age: 30 },
        { name: 'Bob', age: 25 },
    ]

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('calls saveAs when exporting to CSV', () => {
        exportToCSV(data, 'test.csv')
        expect(saveAs).toHaveBeenCalled()
        const callArg = (saveAs as any).mock.calls[0][0]
        expect(callArg instanceof Blob).toBe(true)
    })

    it('calls saveAs when exporting to Excel', () => {
        exportToExcel(data, 'test.xlsx')
        expect(saveAs).toHaveBeenCalled()
        const callArg = (saveAs as any).mock.calls[0][0]
        expect(callArg instanceof Blob).toBe(true)
    })
})
