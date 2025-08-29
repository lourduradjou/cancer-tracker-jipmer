import { Inter } from 'next/font/google'
import { ReactNode } from 'react'
import './globals.css'
import Providers from '@/components/layout/Providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
    title: 'Compass - JIPMER',
    description:
        'Compass - Jipmer pondy is an app designed to handle, care and help cancer patients.',
    manifest: '/manifest.json',
}

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                {/* <script crossOrigin="anonymous" src="//unpkg.com/react-scan/dist/auto.global.js" /> */}
            </head>
            <body className={inter.className}>
                <Providers>{children}</Providers>
            </body>
        </html>
    )
}
