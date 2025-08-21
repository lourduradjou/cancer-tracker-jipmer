import Navbar from '@/components/layout/Navbar'
import { ReactNode } from 'react'

export const metadata = {
    title: 'Compass - JIPMER',
    description:
        'Compass - Jipmer pondy is an app designed to handle, care and help cancer patients.',
}

export default function CompassLayout({ children }: { children: ReactNode }) {
    return (
        <div>
            <Navbar />
            {children}
        </div>
    )
}
