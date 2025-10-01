import { Inter } from 'next/font/google'
import { ReactNode } from 'react'
import './globals.css'
import Providers from '@/components/layout/Providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
    title: 'PuduCan',
    description:
        'PuduCan is an app designed to handle, care and help cancer patients of puducherry, pondicherry, karaikal, mahe. To manage the government and primary phc schools',
}

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link rel="manifest" href="/manifest.json" />
                {/* <script crossOrigin="anonymous" src="//unpkg.com/react-scan/dist/auto.global.js" /> */}
            </head>
            <body className={inter.className}>
                <Providers>{children}</Providers>
            </body>
        </html>
    )
}
