"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStatus } from "@/hooks/useAuthStatus";
import Loading from "@/components/ui/loading";

export default function RootPage() {
	const router = useRouter();
	const { checking, isLoggedIn } = useAuthStatus();

	useEffect(() => {
		if (!checking) {
			router.push(isLoggedIn ? "/home" : "/login");
		}
	}, [checking, isLoggedIn, router]);

	return (
		<main className="flex flex-col items-center justify-center h-screen">
			<Loading />
		</main>
	);
}
