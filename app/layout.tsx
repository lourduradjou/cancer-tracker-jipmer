'use client'

import ClientLayout from '@/components/layout/ClientLayout'
import { Inter } from 'next/font/google'
import { ReactNode } from 'react'
import './globals.css'
import { Toaster } from 'sonner'
import { ThemeProvider } from '@/components/theme-provider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@/contexts/AuthContext'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const inter = Inter({ subsets: ['latin'] })

const metadata = {
    title: 'Compass - JIPMER',
    description:
        'Compass - Jipmer pondy is a app designed to handle, care and help cancer patients , to maintain their details',
}

const queryClient = new QueryClient()

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className}>
                <QueryClientProvider client={queryClient}>
                    <AuthProvider>
                        <ThemeProvider
                            attribute="class"
                            defaultTheme="system"
                            enableSystem
                            disableTransitionOnChange
                        >
                            <Toaster richColors />
                            <ClientLayout>{children}</ClientLayout>
                        </ThemeProvider>
                    </AuthProvider>
                    <ReactQueryDevtools initialIsOpen={false} />
                </QueryClientProvider>
            </body>
        </html>
    )
}
