import { describe, it, expect } from 'vitest'
import { PatientSchema } from '@/schema/patient'

describe('PatientSchema - name field validation', () => {
    it('should fail when name is empty', () => {
        const result = PatientSchema.safeParse({
            name: '', // ❌ empty
            sex: 'male', // required field
            address: 'Some address',
            assignedHospital: { id: 'h1', name: 'Test Hospital' },
            hasAadhaar: true,
        })

        expect(result.success).toBe(false)
        if (!result.success) {
            expect(result.error.issues[0].message).toBe('Name is required.')
            expect(result.error.issues[0].path).toContain('name')
        }
    })

    it('should fail when name exceeds 100 characters', () => {
        const longName = 'a'.repeat(101)
        const result = PatientSchema.safeParse({
            name: longName, // ❌ too long
            sex: 'male',
            address: 'Some address',
            assignedHospital: { id: 'h1', name: 'Test Hospital' },
            hasAadhaar: true,
        })

        expect(result.success).toBe(false)
        if (!result.success) {
            expect(result.error.issues[0].message).toBe("Name length can't exceed 100 characters")
            expect(result.error.issues[0].path).toContain('name')
        }
    })

    it('should pass when name is valid', () => {
        const result = PatientSchema.safeParse({
            name: 'John Doe', // ✅ valid
            sex: 'male',
            dob: '1990-01-01',
            address: 'Some address',
            assignedHospital: { id: 'h1', name: 'Test Hospital' },
            hasAadhaar: true,
        })
        // console.log(result)

        expect(result.success).toBe(true)
    })
})

