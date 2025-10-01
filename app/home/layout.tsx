// /app/home/layout.tsx
import HomeNavbar from '@/components/home/HomeNavbar'
import HomeHeader from '@/components/home/HomeHeader'
import NavigationLoading from './NavigationLoading'
import { Suspense } from 'react'
import Footer from '@/components/ui/footer'

export default function HomeLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen flex-col ">
            <HomeHeader />
            <HomeNavbar />
            <NavigationLoading />

            <main className="p-4 min-h-screen">{children}</main>

            <Footer />
        </div>
    )
}
