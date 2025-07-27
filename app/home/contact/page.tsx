import {
    TypographyH1,
    TypographyH2,
    TypographyMuted,
    TypographyP,
} from '@/components/ui/typography'

export default function ContactPage() {
    return (
        <div className="mx-auto max-w-3xl p-4">
            <TypographyH2>Contact Us</TypographyH2>

            <TypographyP className="mb-4">
                For any queries or technical issues related to the COMPASS Portal, please reach out
                to us using the following contact information:
            </TypographyP>
            <div className="space-y-4 bg-sidebar-accent rounded p-4 shadow">
                <div>
                    <TypographyP className="font-semibold">Institution:</TypographyP>
                    <div>
                        <TypographyMuted>
                            Jawaharlal Institute of Postgraduate Medical Education and Research
                            (JIPMER)
                        </TypographyMuted>
                    </div>
                </div>

                <div>
                    <TypographyP className="font-semibold">Address:</TypographyP>

                    <TypographyMuted>
                        JIPMER Campus Rd, Gorimedu, Dhanvantari Nagar, Puducherry - 605006
                    </TypographyMuted>
                </div>

                <div>
                    <TypographyP className="font-semibold">Email:</TypographyP>
                    <TypographyMuted>compass-support@jipmer.edu.in</TypographyMuted>
                </div>

                <div>
                    <TypographyP className="font-semibold">Phone:</TypographyP>
                    <TypographyMuted>+91 2222 2222</TypographyMuted>
                </div>
            </div>
        </div>
    )
}
