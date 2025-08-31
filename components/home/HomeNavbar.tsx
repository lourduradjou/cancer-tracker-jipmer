'use client'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDown, ChevronRight, ChevronUp, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NAV_LINKS } from '@/constants/navbar'
import { useState } from 'react'

export default function HomeNavbar() {
    const pathname = usePathname()
    const [mobileOpen, setMobileOpen] = useState(false)
    const [mobileDataEntryOpen, setMobileDataEntryOpen] = useState(false)

    const navItem = (label: string, href: string, exact = false) => {
        const isActive = exact ? pathname === href : pathname.startsWith(href)
        return (
            <Link
                href={href}
                onClick={() => setMobileOpen(false)} // close on click
                className={`group relative block rounded px-4 py-2 ${
                    isActive ? 'font-semibold text-blue-600' : ''
                }`}
            >
                <span className="relative z-10 hover:bg-accent sm:hover:bg-transparent p-2">{label}</span>
                {/* underline animation */}
                <span className="hidden sm:block absolute bottom-0 left-0 h-0.5 w-0 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
        )
    }

    return (
        <nav className="border-b-2 px-6 py-3">
            <div className="flex items-center justify-between">
                {/* Logo / Title */}
                <div className="text-lg font-bold">COMPASS</div>

                {/* Desktop Nav */}
                <div className="hidden items-center space-x-4 sm:flex">
                    {navItem('Home', '/home', true)}
                    {navItem('About COMPASS', '/home/about')}
                    {navItem('Reports', '/home/reports')}

                    <DropdownMenu>
                        <DropdownMenuTrigger className="flex items-center rounded px-4 py-2 focus:outline-none group relative">
                            <span className="relative z-10">Data Entry</span>
                            <ChevronDown className="ml-1 h-4 w-4" />
                            {/* underline animation */}
                            <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
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

                {/* Mobile Hamburger */}
                <button
                    className="flex items-center p-2 sm:hidden"
                    onClick={() => setMobileOpen(!mobileOpen)}
                >
                    {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            <div
                className={`overflow-hidden transition-all duration-300 sm:hidden ${
                    mobileOpen ? 'mt-2 max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
            >
                <div className="flex flex-col space-y-1 border-t pt-2">
                    {navItem('Home', '/home', true)}
                    {navItem('About COMPASS', '/home/about')}
                    {navItem('Reports', '/home/reports')}

                    {/* Data Entry toggle in mobile */}
                    <button
                        onClick={() => setMobileDataEntryOpen(!mobileDataEntryOpen)}
                        className="flex items-center justify-between px-4 py-2 text-left text-sm font-medium"
                    >
                        <span>Data Entry</span>
                        {mobileDataEntryOpen ? (
                            <ChevronUp className="h-4 w-4" />
                        ) : (
                            <ChevronRight className="h-4 w-4" />
                        )}
                    </button>

                    <div
                        className={`mt-1 ml-4 space-y-2 overflow-hidden transition-all duration-300 border-l-2 ${
                            mobileDataEntryOpen ? 'max-h-60' : 'max-h-0'
                        }`}
                    >
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.name}
                                href={link.path}
                                onClick={() => setMobileOpen(false)}
                                className="group relative block rounded pl-4  ml-2 *:py-1 text-sm hover:bg-accent"
                            >
                                <span className="relative z-10">{link.name}</span>
                                {/* underline animation */}

                            </Link>
                        ))}
                    </div>

                    {navItem('Contact Us', '/home/contact')}
                </div>
            </div>
        </nav>
    )
}
