// hooks/useAuthStatus.ts
'use client'

import { auth, db } from '@/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { useEffect, useState } from 'react'

export function useAuthStatus() {
    const [checking, setChecking] = useState(true)
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                setIsLoggedIn(false)
                setChecking(false)
                return
            }

            try {
                const email = user.email!.trim().toLowerCase()
                const q = query(collection(db, 'users'), where('email', '==', email))
                const snap = await getDocs(q)
                setIsLoggedIn(!snap.empty)
            } catch (e) {
                setIsLoggedIn(false)
            } finally {
                setChecking(false)
            }
        })

        return () => unsub()
    }, [])

    return { checking, isLoggedIn }
}
