export const SEARCH_FIELDS = {
    patients: ['name', 'aadhaarId', 'phoneNumber'] as const,
    hospitals: ['name', 'address', 'phoneNumber'] as const,
    doctors: ['name', 'email', 'phoneNumber'] as const,
    nurses: ['name', 'email', 'phoneNumber'] as const,
    ashas: ['name', 'email', 'phoneNumber'] as const,
} as const;

// This type represents all entity names
export type Entity = keyof typeof SEARCH_FIELDS; // 'patients' | 'hospitals' | 'doctors' | 'nurses' | 'ashas'

// This type represents all search fields for a specific entity
export type SearchField<T extends Entity> = typeof SEARCH_FIELDS[T][number];
