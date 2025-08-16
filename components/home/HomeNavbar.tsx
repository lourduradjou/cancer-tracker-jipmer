'use client'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NAV_LINKS } from '@/constants/navbar'

export default function HomeNavbar() {
    const pathname = usePathname()

    const navItem = (label: string, href: string, exact = false) => {
        const isActive = exact ? pathname === href : pathname.startsWith(href)
        return (
            <Link
                href={href}
                className={`block rounded px-4 py-2 ${isActive ? 'font-semibold' : ''}`}
            >
                {label}
            </Link>
        )
    }

    return (
        <nav className="flex items-center justify-between border-b-2 px-6 py-3">
            <div className="flex items-center space-x-4">
                {navItem('Home', '/home', true)}
                {navItem('About COMPASS', '/home/about')}
                {navItem('Reports', '/home/reports')}

                {/* Dropdown with shadcn/ui */}
                <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center rounded px-4 py-2 focus:outline-none">
                        Data Entry
                        <ChevronDown className="ml-1 h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-44">
                        {NAV_LINKS.map((link) => (
                            <DropdownMenuItem asChild key={link.name}>
                                <Link href={link.path}>{link.name}</Link>
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                {navItem('Contact Us', '/home/contact')}
            </div>
        </nav>
    )
}
