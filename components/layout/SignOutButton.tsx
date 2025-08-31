'use client'

import { Button } from '@/components/ui/button'
import { auth } from '@/firebase'
import { signOut } from 'firebase/auth'
import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function SignOutButton({ className }: { className?: string }) {
    const router = useRouter()

    const handleSignOut = async () => {
        await signOut(auth)
        router.push('/login')
    }

    return (
        <Button
            variant="destructive"
            onClick={handleSignOut}
            className={`flex items-center gap-2 ${className}`}
        >
            <LogOut className="h-4 w-4" />
            Sign Out
        </Button>
    )
}
