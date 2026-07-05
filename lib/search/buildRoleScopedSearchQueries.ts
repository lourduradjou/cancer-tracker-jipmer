import {
    collection,
    limit,
    or,
    orderBy,
    query,
    startAfter,
    where,
    type DocumentSnapshot,
    type Query,
} from 'firebase/firestore'
import { db } from '@/firebase'

type SearchTab = 'patients' | 'removedPatients' | 'hospitals' | 'doctors' | 'nurses' | 'ashas'

type SearchScope = {
    orgId?: string | null
    ashaId?: string | null
}

type SearchOptions = {
    pageSize: number
    cursor?: DocumentSnapshot | null
}

const isNumericTerm = (term: string) => /^[0-9]+$/.test(term.replace(/[\s-]/g, ''))

const getCollectionName = (tab: SearchTab) => {
    if (tab === 'removedPatients') return 'removedPatients'
    if (tab === 'hospitals') return 'hospitals'
    if (tab === 'patients' || tab === 'doctors' || tab === 'nurses' || tab === 'ashas') {
        return tab === 'patients' ? 'patients' : 'users'
    }

    return 'users'
}

const getScopedCollectionQuery = (tab: SearchTab, scope: SearchScope) => {
    const collectionName = getCollectionName(tab)
    const collectionRef = collection(db, collectionName)

    if (tab === 'patients' || tab === 'removedPatients') {
        if (scope.orgId) {
            return query(collectionRef, where('assignedHospital.id', '==', scope.orgId))
        }

        if (scope.ashaId) {
            return query(collectionRef, where('assignedAsha', '==', scope.ashaId))
        }
    }

    return query(collectionRef)
}

export function buildRoleScopedSearchQueries(
    tab: SearchTab,
    rawTerm: string,
    scope: SearchScope,
    { pageSize, cursor }: SearchOptions
): {
    primaryQuery: Query | null
    secondaryQuery: Query | null
} {
    const term = rawTerm.trim()

    if (!term) {
        return {
            primaryQuery: null,
            secondaryQuery: null,
        }
    }

    const scopedCollectionQuery = getScopedCollectionQuery(tab, scope)
    const shouldPaginateByCursor = !!cursor
    const primaryField = 'name'
    const prefixEnd = `${term}\uf8ff`

    const primaryQuery = query(
        scopedCollectionQuery,
        where(primaryField, '>=', term),
        where(primaryField, '<=', prefixEnd),
        orderBy(primaryField),
        ...(shouldPaginateByCursor ? [startAfter(cursor)] : []),
        limit(pageSize)
    )

    if (!isNumericTerm(term)) {
        return {
            primaryQuery,
            secondaryQuery: null,
        }
    }

    if (tab === 'patients' || tab === 'removedPatients') {
        return {
            primaryQuery,
            secondaryQuery: query(
                scopedCollectionQuery,
                or(
                    where('phoneNumber', 'array-contains', term),
                    where('aadhaarId', '==', term)
                )
            ),
        }
    }

    if (tab === 'hospitals') {
        return {
            primaryQuery,
            secondaryQuery: query(scopedCollectionQuery, where('contactNumber', '==', term)),
        }
    }

    return {
        primaryQuery,
        secondaryQuery: query(scopedCollectionQuery, where('phoneNumber', '==', term)),
    }
}