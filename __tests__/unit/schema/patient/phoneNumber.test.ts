import { describe, it, expect } from 'vitest'
import { PatientSchema } from '@/schema/patient'

// Base valid patient object
const basePatient = {
  name: "John Doe",
  caregiverName: "Jane Doe",
  sex: "male",
  dob: "1990-01-01",
  address: "Some address",
  assignedHospital: { id: "h1", name: "Test Hospital" },
  hasAadhaar: true,
}

describe("PatientSchema - phoneNumber field", () => {
  it("should allow undefined phoneNumber", () => {
    const result = PatientSchema.safeParse({
      ...basePatient,
      phoneNumber: undefined,
    })
    expect(result.success).toBe(true)
  })

  it("should allow empty array", () => {
    const result = PatientSchema.safeParse({
      ...basePatient,
      phoneNumber: [],
    })
    expect(result.success).toBe(true)
  })

  it("should allow array of strings", () => {
    const result = PatientSchema.safeParse({
      ...basePatient,
      phoneNumber: ["1234567890", "9876543210"],
    })
    expect(result.success).toBe(true)
  })

  it("should allow array with undefined values", () => {
    const result = PatientSchema.safeParse({
      ...basePatient,
      phoneNumber: ["1234567890", undefined],
    })
    expect(result.success).toBe(true)
  })

  it("should fail if phoneNumber is not an array", () => {
    const result = PatientSchema.safeParse({
      ...basePatient,
      phoneNumber: "not-an-array",
    })
    expect(result.success).toBe(false)
  })

  it("should fail if phoneNumber contains non-string values", () => {
    const result = PatientSchema.safeParse({
      ...basePatient,
      phoneNumber: ["1234567890", 1234 as any],
    })
    expect(result.success).toBe(false)
  })
})
