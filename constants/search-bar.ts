export const SEARCH_FIELDS = {
    patients: ['name', 'aadhaarId', 'phoneNumber'] as const,
    hospitals: ['name', 'address', 'phoneNumber'] as const,
    doctors: ['name', 'email', 'phoneNumber'] as const,
    nurses: ['name', 'email', 'phoneNumber'] as const,
    ashas: ['name', 'email', 'phoneNumber'] as const,
}
