import { TypographyH2, TypographyMuted } from '@/components/ui/typography'

// /app/home/page.tsx
export default function HomePage() {
    return (
        <div className="mx-auto mt-10 max-w-4xl">
            <TypographyH2 className="mb-4 text-3xl font-bold">
                Welcome to the COMPASS Portal
            </TypographyH2>

            <TypographyMuted className="mb-4">
                This portal is a part of the COMPASS project — a national Hybrid II Implementation
                Study led by JIPMER, aimed at improving patient-reported outcomes and care
                experiences along the cancer care continuum.
            </TypographyMuted>

            <ul className="mb-6 list-disc pl-6 font-light">
                <li>
                    Enter data as a <strong>Doctor</strong>, <strong>Nurse</strong>, or{' '}
                    <strong>ASHA</strong> using the <em>Data Entry</em> menu above.
                </li>
                <li>
                    Access project reports and updates under the <em>Reports</em> section.
                </li>
                <li>
                    Learn more about the project in the <em>About COMPASS</em> section.
                </li>
                <li>
                    Use the <em>Contact Us</em> link for support or inquiries.
                </li>
            </ul>

            <TypographyMuted className="">
                If you&apos;re unsure where to begin, choose your role from the{' '}
                <strong>Data Entry</strong> dropdown in the navigation bar above.
            </TypographyMuted>
        </div>
    )
}
