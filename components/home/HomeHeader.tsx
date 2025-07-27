// components/HomeHeader.tsx
import Image from 'next/image'
import { ModeToggle } from '../ui/toggle'

export default function HomeHeader() {
    return (
        <header className="text-white flex w-full items-center justify-between bg-[#0e65bc] px-4 py-3 shadow">
            <div className="flex items-center space-x-3">
                <Image
                    src="/jipmer-logo.png"
                    alt="JIPMER Logo"
                    width={50}
                    height={50}
                    className="object-contain"
                />

                <div className="leading-tight">
                    <h1 className="text-lg font-semibold sm:text-2xl">
                        <span className="block sm:inline">COMPASS</span>
                        <span className="hidden sm:inline">
                            {' '}
                            - Community-Oriented Model of Patient Navigation System
                        </span>
                    </h1>
                    <p className="hidden text-xs sm:block sm:text-sm">
                        Improving Patient Reported Outcomes and Care Experiences
                    </p>
                </div>
            </div>

            {/* ICMR Logo - Hidden on small screens */}
            <div className="hidden sm:flex items-center space-x-4">
                <div className="text-foreground">
                    <ModeToggle />
                </div>
                <Image
                    src="/icmr.svg"
                    alt="ICMR Logo"
                    width={150}
                    height={100}
                    className="rounded bg-white object-contain p-1"
                />
            </div>
        </header>
    )
}
