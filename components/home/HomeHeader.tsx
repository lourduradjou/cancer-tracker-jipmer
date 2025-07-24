// components/HomeHeader.tsx
import Image from 'next/image';

export default function HomeHeader() {
	return (
		<header className="w-full bg-[#0e65bc] text-white px-4 py-3 shadow flex items-center justify-between">
			<div className="flex items-center space-x-3">
				<Image
					src="/jipmer-logo.png"
					alt="JIPMER Logo"
					width={50}
					height={50}
					className="object-contain"
				/>

				<div className="leading-tight">
					<h1 className="text-lg sm:text-2xl font-semibold">
						<span className="block sm:inline">COMPASS</span>
						<span className="hidden sm:inline">
							{" "}
							- Community-Oriented Model of Patient Navigation System
						</span>
					</h1>
					<p className="text-xs sm:text-sm hidden sm:block">
						Improving Patient Reported Outcomes and Care Experiences
					</p>
				</div>
			</div>

			{/* ICMR Logo - Hidden on small screens */}
			<div className="hidden sm:block">
				<Image
					src="/icmr.svg"
					alt="ICMR Logo"
					width={150}
					height={100}
					className="object-contain bg-white p-1 rounded"
				/>
			</div>
		</header>
	);
}
