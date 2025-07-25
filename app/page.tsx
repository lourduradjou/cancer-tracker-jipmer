'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Loading from '@/components/ui/loading';

export default function RootPage() {
	const router = useRouter();

	useEffect(() => {
		router.push('/home');
	}, [router]);

	return (
		<main className="flex flex-col items-center justify-center h-screen">
			<Loading />
		</main>
	);
}
