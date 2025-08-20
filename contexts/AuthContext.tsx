'use client'

import Loading from '@/components/ui/loading'
import { auth, db } from '@/firebase'
import { AuthState, UserDoc } from '@/schema/user'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { User as FirebaseAuthUser, onAuthStateChanged } from 'firebase/auth'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { usePathname, useRouter } from 'next/navigation'
import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { toast } from 'sonner'

const AuthContext = createContext<AuthState | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const router = useRouter()
    const queryClient = useQueryClient()
    const currentPath = usePathname()

    const [firebaseUser, setFirebaseUser] = useState<FirebaseAuthUser | null>(null)
    const [initialAuthLoading, setInitialAuthLoading] = useState(true)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setFirebaseUser(user)
            setInitialAuthLoading(false)
        })
        return () => unsubscribe()
    }, [])

    const {
        data: userDoc,
        isLoading: isLoadingUserRole,
        isError: isErrorUserRole,
        error: userRoleError,
    } = useQuery<UserDoc, Error>({
        queryKey: ['userDoc', firebaseUser?.uid],
        queryFn: async () => {
            if (!firebaseUser) {
                throw new Error('No authenticated user to fetch role for.')
            }
            const userEmail = firebaseUser.email!.trim().toLowerCase()
            const userQuery = query(collection(db, 'users'), where('email', '==', userEmail))
            const userSnap = await getDocs(userQuery)

            if (userSnap.empty) {
                throw new Error('User data not found in Firestore.')
            }
            return userSnap.docs[0].data() as UserDoc
        },
        enabled: !!firebaseUser && !initialAuthLoading,
        staleTime: 5 * 60 * 1000,
        retry: false,
    })

    const isLoadingAuth = Boolean(initialAuthLoading || (firebaseUser && isLoadingUserRole))
    const role = userDoc?.role || null
    const orgId = userDoc?.orgId || null
    const error = isErrorUserRole ? userRoleError : null

    // Redirect unauthenticated users from protected routes
    useEffect(() => {
        const publicPaths = ['/login', '/', '/home']
        const isPublicPath = publicPaths.some(
            (path) => path === currentPath || (path.endsWith('/') && currentPath.startsWith(path))
        )

        if (!initialAuthLoading && !firebaseUser && !isPublicPath) {
            toast.error('You must be logged in to view this page.')
            router.push('/login')
        }
    }, [initialAuthLoading, firebaseUser, router, currentPath])

    // Redirect authenticated users from login to their role-specific pages
    useEffect(() => {
        if (!initialAuthLoading && firebaseUser && userDoc && currentPath === '/login') {
            const roleRoutes: Record<string, string> = {
                'admin': '/admin',
                'asha': '/asha',
                'nurse': '/nurse',
                'doctor': '/doctor',
                // Add other roles as needed
            }

            const targetRoute = roleRoutes[userDoc.role] || '/dashboard'
            router.push(targetRoute)
            toast.success(`Welcome back! Redirecting to your ${userDoc.role} dashboard.`)
        }
    }, [initialAuthLoading, firebaseUser, userDoc, currentPath, router])

    // Handle user role errors
    useEffect(() => {
        if (isErrorUserRole && firebaseUser) {
            toast.error(error?.message || 'Failed to load user profile. Please log in again.')
            auth.signOut()
            router.push('/login')
            queryClient.removeQueries({ queryKey: ['userDoc', firebaseUser.uid] })
        }
    }, [isErrorUserRole, firebaseUser, error, router, queryClient])

    if (isLoadingAuth) {
        return (
            <main className="flex h-screen flex-col items-center justify-center">
                <Loading />
                <p className="mt-4 text-gray-600">Checking authentication...</p>
            </main>
        )
    }

    const authState: AuthState = {
        user: firebaseUser,
        role,
        orgId,
        isLoadingAuth,
        error,
    }

    return <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context === undefined) throw new Error('useAuth must be used within an AuthProvider')
    return context
}
