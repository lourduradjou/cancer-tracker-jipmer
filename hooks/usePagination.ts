// hooks/usePagination.ts
import { useEffect, useMemo, useState } from 'react'

export function usePagination<T>(data: T[], rowsPerPage: number) {
	const [currentPage, setCurrentPage] = useState(1)

	const totalPages = Math.ceil(data.length / rowsPerPage)

	useEffect(() => {
		setCurrentPage(1)
	}, [data.length, rowsPerPage])

	useEffect(() => {
		if (currentPage > totalPages) setCurrentPage(totalPages)
	}, [currentPage, totalPages])

	const paginated = useMemo(() => {
		const startIndex = (currentPage - 1) * rowsPerPage
		return data.slice(startIndex, startIndex + rowsPerPage)
	}, [data, currentPage, rowsPerPage])

	return {
		paginated,
		currentPage,
		totalPages,
		setCurrentPage,
	}
}
