'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth, db } from '@/firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Eye, EyeOff } from 'lucide-react'
import Image from 'next/image'

export default function LoginPage() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [showPassword, setShowPassword] = useState(false)
	const [loading, setLoading] = useState(false)
	const router = useRouter()

	const isValidEmail = (email: string) =>
		/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

	const handleLogin = async () => {
		if (!email.trim() || !password.trim()) {
			toast.error('Email and Password are required')
			return
		}

		if (!isValidEmail(email.trim())) {
			toast.warning('Enter a valid email')
			return
		}

		if (password.length < 6) {
			toast.error('Password must be at least 6 characters')
			return
		}

		try {
			setLoading(true)

			const cred = await signInWithEmailAndPassword(
				auth,
				email.trim().toLowerCase(),
				password
			)

			const q = query(
				collection(db, 'users'),
				where('email', '==', cred.user.email!.trim().toLowerCase())
			)
			const snap = await getDocs(q)

			if (snap.empty) {
				toast.error('No user record found. Contact admin.')
				return
			}

			const userData = snap.docs[0].data()
			const role = userData.role

			if (!role) {
				toast.error('No role assigned. Contact admin.')
				return
			}

			toast.success('Signed in! Redirecting...')

			if (role === 'doctor') router.push('/doctor')
			else if (role === 'asha') router.push('/asha')
			else if (role === 'nurse') router.push('/nurse')
			else if (role === 'admin') router.push('/admin')
			else router.push('/')
		} catch {
			toast.error('Login failed')
		} finally {
			setLoading(false)
		}
	}

	const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (e.key === 'Enter') handleLogin()
	}

	return (
		<section
			className='relative min-h-screen w-full'
			onKeyDown={handleKeyDown}
		>
			{/* Background Image with lazy load */}
			<Image
				src='/login-bg.jpg'
				alt='Login background'
				layout='fill'
				objectFit='cover'
				priority
				className='z-0'
			/>

			{/* Overlay */}
			<div className='absolute inset-0 bg-black/30  z-10'></div>

			{/* Form */}
			<div className='relative z-20 flex items-center justify-center min-h-screen px-4'>
				<div className='max-w-md w-full bg-background opacity-85 backdrop-blur p-6 rounded-lg shadow-md space-y-6'>
					<h1 className='text-2xl font-bold text-center'>
						<span className='text-green-600'>JIPMER</span> LOGIN
					</h1>

					{/* Email */}
					<Input
						placeholder='Email'
						type='email'
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className='bg-gray-200 focus:outline-none focus:ring-black'
					/>

					{/* Password */}
					<div className='relative'>
						<Input
							placeholder='Password'
							type={showPassword ? 'text' : 'password'}
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className='bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10'
						/>
						<button
							type='button'
							onClick={() => setShowPassword((prev) => !prev)}
							className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600'
						>
							{showPassword ? (
								<EyeOff size={18} />
							) : (
								<Eye size={18} />
							)}
						</button>
					</div>

					<Button
						onClick={handleLogin}
						className='w-full cursor-pointer'
						disabled={loading}
					>
						{loading ? 'Signing In...' : 'Sign In'}
					</Button>
				</div>
			</div>
		</section>
	)
}
