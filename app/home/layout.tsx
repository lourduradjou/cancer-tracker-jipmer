// /app/home/layout.tsx
import HomeNavbar from '@/components/home/HomeNavbar'
import HomeHeader from '@/components/home/HomeHeader'
import NavigationLoading from './NavigationLoading'
import { Suspense } from 'react'

export default function HomeLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen flex-col">
            <HomeHeader />
            <HomeNavbar />
            <NavigationLoading />

            <main className="flex-1 overflow-auto p-4">{children}</main>
        </div>
    )
}
