'use client'

import { Button } from '@/components/ui/button'
import { auth, db } from '@/firebase'
import { signOut } from 'firebase/auth'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { Menu } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ModeToggle } from '../ui/toggle'

export default function Navbar() {
    const [username, setUsername] = useState<string | null>(null)
    const [menuOpen, setMenuOpen] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const fetchUsername = async () => {
            const user = auth.currentUser
            if (!user) return

            const q = query(
                collection(db, 'users'),
                where('email', '==', user.email!.trim().toLowerCase())
            )
            const snap = await getDocs(q)

            if (!snap.empty) {
                const userData = snap.docs[0].data()
                setUsername(userData.name || user.email)
            }
        }

        fetchUsername()
    }, [])

    const handleSignOut = async () => {
        await signOut(auth)
        router.push('/login')
    }

    return (
        <nav className="bg-background flex items-center justify-between border-b px-4 py-3 shadow md:px-8">
            <Link href="/" className="text-2xl font-bold text-green-600">
                Compass
            </Link>

            <div className="md:hidden">
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="text-gray-600 focus:outline-none"
                >
                    <Menu className="h-6 w-6" />
                </button>
            </div>

            <div
                className={`${
                    menuOpen ? 'block' : 'hidden'
                } w-full md:flex md:w-auto md:items-center md:space-x-4`}
            >
                <ModeToggle />

                <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
                    {username && (
                        <span className="mb-2 font-medium text-gray-700 capitalize select-none md:mb-0">
                            Hello, {username}
                        </span>
                    )}

                    <Button
                        variant="destructive"
                        onClick={handleSignOut}
                        className="w-full cursor-pointer md:w-auto"
                    >
                        Sign Out
                    </Button>
                </div>
            </div>
        </nav>
    )
}
