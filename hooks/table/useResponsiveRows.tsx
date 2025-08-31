import { useEffect, useState } from 'react'

export function useResponsiveRows(reservedHeight = 300, rowHeight = 52, minRows = 4) {
    const [rowsPerPage, setRowsPerPage] = useState(minRows)

    useEffect(() => {
        let resizeTimeout: NodeJS.Timeout

        const calculateRows = () => {
            const windowHeight = window.innerHeight
            const usable = windowHeight - reservedHeight
            const rows = Math.max(minRows, Math.floor(usable / rowHeight))
            setRowsPerPage(rows)
        }

        const handleResize = () => {
            clearTimeout(resizeTimeout)
            resizeTimeout = setTimeout(calculateRows, 150)
        }

        calculateRows()
        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
            clearTimeout(resizeTimeout)
        }
    }, [reservedHeight, rowHeight, minRows])

    return rowsPerPage
}
