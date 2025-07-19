import ClientLayout from '@/components/layout/ClientLayout'
import { Inter } from 'next/font/google'
import { ReactNode } from 'react'
import './globals.css'
import { Toaster } from 'sonner'
import { ThemeProvider } from '@/components/theme-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
	title: 'Compass - JIPMER',
	description: 'Compass - Jipmer pondy is a app designed to handle, care and help cancer patients , to maintain their details',
}

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang='en' suppressHydrationWarning>
			<body className={inter.className}>
				<ThemeProvider
					attribute='class'
					defaultTheme='system'
					enableSystem
					disableTransitionOnChange
				>
					<Toaster richColors />
					<ClientLayout>{children}</ClientLayout>
				</ThemeProvider>
			</body>
		</html>
	)
}
