'use client'

import { useAuthStatus } from '@/hooks/useAuthStatus'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'
import Navbar from './Navbar'

export default function ClientLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname()
    const { checking } = useAuthStatus() // 🔄 shared auth check

    if (checking) return null

    const hideNavbar = pathname === '/login' || pathname === '/' || pathname.startsWith('/home')

    return (
        <>
            {!hideNavbar && <Navbar />}
            {children}
        </>
    )
}
