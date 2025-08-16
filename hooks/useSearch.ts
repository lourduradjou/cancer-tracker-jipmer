import { useMemo, useState } from 'react'

export function useSearch<T>(rows: T[], searchFields: (keyof T)[] = []) {
    const [searchTerm, setSearchTerm] = useState('')

    const filteredRows = useMemo(() => {
        if (!searchTerm) return rows

        const term = searchTerm.toLowerCase()
        return rows.filter((row) =>
            searchFields.some((field) => {
                const value = row[field]
                if (!value) return false
                if (Array.isArray(value))
                    return value.some((v) => v?.toString().toLowerCase().includes(term))
                return value.toString().toLowerCase().includes(term)
            })
        )
    }, [rows, searchTerm, searchFields])

    return { filteredRows, searchTerm, setSearchTerm }
}
