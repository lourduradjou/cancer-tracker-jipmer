import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { getDocs, type DocumentSnapshot } from 'firebase/firestore'
import { useThrottledValue } from '@/hooks/useThrottledValue'
import { buildRoleScopedSearchQueries } from '@/lib/search/buildRoleScopedSearchQueries'
import { useResponsiveRows } from '@/hooks/table/useResponsiveRows'

type SearchTab = 'ashas' | 'doctors' | 'nurses' | 'hospitals' | 'patients' | 'removedPatients'

type SearchScope = {
    orgId?: string | null
    ashaId?: string | null
}

type RowWithId = {
    id: string
}

export function useTableSearch<T extends RowWithId>({
    rows,
    activeTab,
    scope,
}: {
    rows: T[]
    activeTab: SearchTab
    scope: SearchScope
}) {
    const [searchTerm, setSearchTerm] = useState('')
    const throttledSearchTerm = useThrottledValue(searchTerm, 400)
    const rowsPerPage = useResponsiveRows()

    const [isSearching, setIsSearching] = useState(false)
    const [searchRows, setSearchRows] = useState<T[]>([])
    const [cursorStack, setCursorStack] = useState<(DocumentSnapshot | null)[]>([null])
    const [lastVisibleDoc, setLastVisibleDoc] = useState<DocumentSnapshot | null>(null)
    const [lastPrimaryCount, setLastPrimaryCount] = useState(0)
    const [lastPageSizeUsed, setLastPageSizeUsed] = useState(0)

    const requestIdRef = useRef(0)
    const cursorStackRef = useRef<(DocumentSnapshot | null)[]>([null])

    useEffect(() => {
        cursorStackRef.current = cursorStack
    }, [cursorStack])

    const isSearchActive = throttledSearchTerm.trim().length > 0

    const fetchSearchPage = useCallback(
        async (term: string, cursor: DocumentSnapshot | null, includeSecondary: boolean) => {
            const trimmedTerm = term.trim()
            if (!trimmedTerm) return

            const pageSize = rowsPerPage
            const currentRequestId = ++requestIdRef.current

            setIsSearching(true)
            setLastPageSizeUsed(pageSize)

            try {
                const { primaryQuery, secondaryQuery } = buildRoleScopedSearchQueries(
                    activeTab,
                    trimmedTerm,
                    scope,
                    { pageSize, cursor }
                )

                if (!primaryQuery) {
                    if (currentRequestId !== requestIdRef.current) return
                    setSearchRows([])
                    setLastVisibleDoc(null)
                    setLastPrimaryCount(0)
                    return
                }

                const primarySnap = await getDocs(primaryQuery)
                if (currentRequestId !== requestIdRef.current) return

                const primaryRows = primarySnap.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as T[]

                setLastPrimaryCount(primarySnap.docs.length)
                setLastVisibleDoc(
                    primarySnap.docs.length > 0
                        ? primarySnap.docs[primarySnap.docs.length - 1]
                        : null
                )

                if (!includeSecondary || !secondaryQuery) {
                    // v1 behavior: page 2+ intentionally shows only primary-query matches.
                    // Secondary phone/aadhaar exact matches are fetched only for page 1.
                    setSearchRows(primaryRows)
                    return
                }

                const secondarySnap = await getDocs(secondaryQuery)
                if (currentRequestId !== requestIdRef.current) return

                const secondaryRows = secondarySnap.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as T[]

                const deduped = new Map<string, T>()
                for (const row of primaryRows) deduped.set(row.id, row)
                for (const row of secondaryRows) deduped.set(row.id, row)

                setSearchRows(Array.from(deduped.values()))
            } finally {
                if (currentRequestId === requestIdRef.current) {
                    setIsSearching(false)
                }
            }
        },
        [activeTab, rowsPerPage, scope]
    )

    useEffect(() => {
        const term = throttledSearchTerm.trim()

        if (!term) {
            requestIdRef.current += 1
            queueMicrotask(() => {
                setCursorStack([null])
                setSearchRows([])
                setLastVisibleDoc(null)
                setLastPrimaryCount(0)
                setLastPageSizeUsed(0)
                setIsSearching(false)
            })
            return
        }

        queueMicrotask(() => {
            setCursorStack([null])
            void fetchSearchPage(term, null, true)
        })
    }, [throttledSearchTerm, activeTab, scope.orgId, scope.ashaId, fetchSearchPage])

    const hasNextSearchPage = useMemo(() => {
        if (!isSearchActive) return false
        if (!lastVisibleDoc) return false
        if (lastPageSizeUsed <= 0) return false
        return lastPrimaryCount === lastPageSizeUsed
    }, [isSearchActive, lastVisibleDoc, lastPrimaryCount, lastPageSizeUsed])

    const searchCurrentPage = cursorStack.length
    const searchTotalPages = searchCurrentPage + (hasNextSearchPage ? 1 : 0)

    const goToSearchPage = useCallback(
        (target: number) => {
            if (!isSearchActive) return
            if (target < 1) return

            const currentStack = cursorStackRef.current
            const currentPage = currentStack.length
            const term = throttledSearchTerm.trim()
            if (!term) return

            if (target <= currentPage) {
                const nextStack = currentStack.slice(0, target)
                setCursorStack(nextStack)

                const targetCursor = nextStack[target - 1] ?? null
                const includeSecondary = target === 1
                void fetchSearchPage(term, targetCursor, includeSecondary)
                return
            }

            if (target === currentPage + 1) {
                if (!lastVisibleDoc) return

                const nextStack = [...currentStack, lastVisibleDoc]
                setCursorStack(nextStack)

                const nextCursor = nextStack[nextStack.length - 1]
                void fetchSearchPage(term, nextCursor, false)
                return
            }
        },
        [fetchSearchPage, isSearchActive, lastVisibleDoc, throttledSearchTerm]
    )

    // v1 limitation: while throttled search is active, patient Filters panel does not apply.
    const filteredRows = isSearchActive ? searchRows : rows

    return {
        filteredRows,
        searchTerm,
        setSearchTerm,
        isSearching,
        isSearchActive,
        searchCurrentPage,
        searchTotalPages,
        goToSearchPage,
    }
}