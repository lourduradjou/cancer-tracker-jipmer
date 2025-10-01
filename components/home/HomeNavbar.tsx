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
import Image from 'next/image'

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
                <span className="hover:bg-accent relative z-10 p-2 sm:hover:bg-transparent">
                    {label}
                </span>
                {/* underline animation */}
                <span className="absolute bottom-0 left-0 hidden h-0.5 w-0 bg-blue-400 transition-all duration-300 group-hover:w-full sm:block"></span>
            </Link>
        )
    }

    return (
        <nav className="border-b-2 px-6 py-3 bg-accent">
            <div className="container mx-auto flex items-center justify-between ">
                {/* Logo / Title */}
                <div className="flex place-items-center">
                    <div className="sm:hidden">
                        <Image
                            src="/jipmer-logo.png"
                            alt="JIPMER Logo"
                            width={60}
                            height={40}
                            className="object-contain"
                        />
                    </div>
                    <div className="text-lg font-bold">PuduCan</div>
                </div>

                {/* Desktop Nav */}
                <div className="hidden items-center space-x-4 sm:flex">
                    {navItem('Home', '/home', true)}
                    {navItem('About', '/home/about')}
                    {navItem('Reports', '/home/reports')}

                    <DropdownMenu>
                        <DropdownMenuTrigger className="group relative flex items-center rounded px-4 py-2 focus:outline-none">
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

                    {navItem('Contact', '/home/contact')}
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
                <div className="flex flex-col space-y-1  pt-2">
                    {navItem('Home', '/home', true)}
                    {navItem('About', '/home/about')}
                    {navItem('Reports', '/home/reports')}

                    {/* Data Entry toggle in mobile */}
                    <button
                        onClick={() => setMobileDataEntryOpen(!mobileDataEntryOpen)}
                        className="flex items-center gap-2 px-6"
                    >
                        <span>Data Entry</span>
                        {mobileDataEntryOpen ? (
                            <ChevronUp className="h-4 w-4" />
                        ) : (
                            <ChevronRight className="h-4 w-4" />
                        )}
                    </button>

                    <div
                        className={`mt-1 ml-4 space-y-2 overflow-hidden transition-all duration-300 ${
                            mobileDataEntryOpen ? 'max-h-60' : 'max-h-0'
                        }`}
                    >
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.name}
                                href={link.path}
                                onClick={() => setMobileOpen(false)}
                                className="ml-2 block pl-4 hover:bg-amber-100"
                            >
                                <span className="relative z-10">{link.name}</span>
                                {/* underline animation */}
                            </Link>
                        ))}
                    </div>

                    {navItem('Contact', '/home/contact')}
                </div>
            </div>
        </nav>
    )
}
