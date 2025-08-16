import { SearchField } from "@/constants/search-bar"
import { useMemo, useState } from "react"

export function useSearch<T, F extends keyof T = keyof T>(
  rows: T[],
  searchFields: any
) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredRows = useMemo(() => {
    if (!searchTerm) return rows

    const term = searchTerm.toLowerCase()
    return rows.filter((row) =>
      searchFields.some((field: any) => {
        const value = row[field as keyof T]
        if (!value) return false
        if (Array.isArray(value))
          return value.some((v) => v?.toString().toLowerCase().includes(term))
        return value.toString().toLowerCase().includes(term)
      })
    )
  }, [rows, searchTerm, searchFields])

  return { filteredRows, searchTerm, setSearchTerm }
}
