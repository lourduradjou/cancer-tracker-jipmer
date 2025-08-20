// store/usePatientFilterStore.ts
import { create } from 'zustand'

type Filters = {
    searchTerm: string
    sexes: string[]
    diseases: string[]
    statuses: string[]
    rationColors: string[]
    age: string | null
    assigned: '' | 'assigned' | 'unassigned'
    transfer: '' | 'transferred' | 'not_transferred'
}

interface PatientFilterState {
    filters: Filters
    setFilter: <K extends keyof Filters>(key: K, value: Filters[K]) => void
    toggleFilterItem: (key: keyof Filters, value: string) => void
    reset: () => void
}

const initialFilters: Filters = {
    searchTerm: '',
    sexes: [],
    diseases: [],
    statuses: [],
    rationColors: [],
    age: null,
    assigned: '',
    transfer: '',
}

export const usePatientFilterStore = create<PatientFilterState>((set) => ({
    filters: initialFilters,
    setFilter: (key, value) =>
        set((state) => ({
            filters: { ...state.filters, [key]: value },
        })),
    toggleFilterItem: (key, value) =>
        set((state) => {
            const arr = state.filters[key] as string[]
            return {
                filters: {
                    ...state.filters,
                    [key]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value],
                },
            }
        }),
    reset: () => set({ filters: initialFilters }),
}))
