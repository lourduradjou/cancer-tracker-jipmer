// /app/home/layout.tsx
import HomeNavbar from '@/components/home/HomeNavbar';
import HomeHeader from '@/components/home/HomeHeader';

export default function HomeLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex flex-col h-screen">
			<HomeHeader />
			<HomeNavbar />
			<main className="flex-1 overflow-auto p-4">{children}</main>
		</div>
	);
}
