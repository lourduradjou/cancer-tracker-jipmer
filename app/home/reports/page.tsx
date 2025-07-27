import {
    TypographyH2,
    TypographyH3,
    TypographyH4,
    TypographyLarge,
    TypographyMuted,
} from '@/components/ui/typography'

export default function ReportsPage() {
    return (
        <div className="mx-auto max-w-4xl p-4">
            <TypographyH2 className="mb-4 text-2xl font-bold">Reports & Dashboards</TypographyH2>

            <TypographyMuted className="mb-6">
                Below is a summary of available reports and statistics collected through the COMPASS
                portal across various PHCs and hospitals.
            </TypographyMuted>

            <div className="space-y-4">
                <div className="bg-sidebar-accent rounded p-4 shadow">
                    <TypographyLarge>Monthly Patient Entry Reports</TypographyLarge>
                    <TypographyMuted className="text-sm">
                        View data entry volume per role (Doctor, Nurse, ASHA) across different
                        months and PHCs.
                    </TypographyMuted>
                </div>

                <div className="bg-sidebar-accent rounded p-4 shadow">
                    <TypographyH4>Monthly Patient Entry Reports</TypographyH4>
                    <TypographyMuted className="text-sm">
                        View data entry volume per role (Doctor, Nurse, ASHA) across different
                        months and PHCs.
                    </TypographyMuted>
                </div>

                <div className="bg-sidebar-accent rounded p-4 shadow">
                    <TypographyH4>Monthly Patient Entry Reports</TypographyH4>
                    <TypographyMuted className="text-sm">
                        View data entry volume per role (Doctor, Nurse, ASHA) across different
                        months and PHCs.
                    </TypographyMuted>
                </div>
            </div>

            <TypographyMuted className="mt-6 text-sm">
                Note: This is a preview. Detailed analytics and data export will be available in the
                admin portal.
            </TypographyMuted>
        </div>
    )
}
