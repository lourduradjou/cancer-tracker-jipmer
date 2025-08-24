// __tests__/unit/schema/patient/sexField.test.ts
import { describe, it, expect } from 'vitest'
import { PatientSchema } from '@/schema/patient'

const basePatient = {
    name: 'John Doe',
    dob: '1990-01-01',
    address: 'Some address',
    assignedHospital: { id: 'h1', name: 'Test Hospital' },
    hasAadhaar: true,
}

describe('PatientSchema - sex field', () => {
    it('should accept valid values', () => {
        expect(() => PatientSchema.parse({ ...basePatient, sex: 'male' })).not.toThrow()

        expect(() => PatientSchema.parse({ ...basePatient, sex: 'female' })).not.toThrow()

        expect(() => PatientSchema.parse({ ...basePatient, sex: 'other' })).not.toThrow()
    })

    it('should reject invalid values', () => {
        const invalidValues = ['', 'Male', 'unknown', 'random', null]

        invalidValues.forEach((value) => {
            const result = PatientSchema.safeParse({ ...basePatient, sex: value as any })
            expect(result.success).toBe(false)

            if (!result.success) {
                expect(result.error.issues[0].message).toBe('Please select a sex.')
                expect(result.error.issues[0].path).toContain('sex')
            }
        })
    })

    it('should fail if sex is missing', () => {
        const result = PatientSchema.safeParse(basePatient as any) // no sex
        expect(result.success).toBe(false)

        if (!result.success) {
            expect(result.error.issues[0].message).toBe('Please select a sex.')
            expect(result.error.issues[0].path).toContain('sex')
        }
    })
})
