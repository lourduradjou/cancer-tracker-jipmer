'use client';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'; // ✅ from shadcn/ui
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function HomeNavbar() {
	const pathname = usePathname();

	const navItem = (label: string, href: string, exact = false) => {
		const isActive = exact ? pathname === href : pathname.startsWith(href);
		return (
			<Link
				href={href}
				className={`block px-4 py-2 rounded  ${
					isActive ? ' font-semibold' : ''
				}`}
			>
				{label}
			</Link>
		);
	};

	return (
		<nav className='flex items-center justify-between  px-6 py-3 border-b-2'>
			<div className='flex items-center space-x-4'>
				{navItem('Home', '/home', true)}
				{navItem('About COMPASS', '/home/about')}
				{navItem('Reports', '/home/reports')}

				{/* Dropdown with shadcn/ui */}
				<DropdownMenu>
					<DropdownMenuTrigger className='flex items-center px-4 py-2 rounded focus:outline-none'>
						Data Entry
						<ChevronDown className='ml-1 h-4 w-4' />
					</DropdownMenuTrigger>
					<DropdownMenuContent className='w-44'>
						<DropdownMenuItem asChild>
							<Link href='/doctor'>Doctor</Link>
						</DropdownMenuItem>
						<DropdownMenuItem asChild>
							<Link href='/nurse'>Nurse</Link>
						</DropdownMenuItem>
						<DropdownMenuItem asChild>
							<Link href='/asha'>ASHA</Link>
						</DropdownMenuItem>
						<DropdownMenuItem asChild>
							<Link href='/admin'>Admin</Link>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>

				{navItem('Contact Us', '/home/contact')}
			</div>
		</nav>
	);
}
