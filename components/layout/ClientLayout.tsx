"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import { useAuthStatus } from "@/hooks/useAuthStatus";

export default function ClientLayout({ children }: { children: ReactNode }) {
	const pathname = usePathname();
	const { checking } = useAuthStatus(); // 🔄 shared auth check

	if (checking) return null;

	const hideNavbar =
		pathname === "/login" ||
		pathname === "/" ||
		pathname.startsWith("/home");

	return (
		<>
			{!hideNavbar && <Navbar />}
			{children}
		</>
	);
}
