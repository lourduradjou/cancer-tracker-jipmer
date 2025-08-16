import { TypographyH2, TypographyMuted, TypographyP } from '@/components/ui/typography'

export default function AboutPage() {
    return (
        <div className="mx-auto mt-10 max-w-[1400px]">
            <TypographyH2 className="mb-4 text-2xl font-bold">About COMPASS</TypographyH2>

            <TypographyMuted>
                The COMPASS project aims to improve patient-reported outcomes and care experiences
                across thecancer care continuum in India through a Community-Oriented Model of
                Patient Navigation System.This hybrid implementation study addresses the rising
                cancer burden in India, where fragmented carepathways and late diagnoses contribute
                to high mortality rates.
            </TypographyMuted>
            <TypographyP>
                The project&apos;s core concept involves introducing and integrating both community
                and hospital navigators to create a conducive environment for patient navigation
                through the health care system. Community navigators will be trained lay workers
                providing informational and emotional support, while hospital navigators will be
                junior nurses or social workers coordinating care and decision making. This dual
                approach aims to bridge gaps in the cancer care pathway from screening to
                survivorship and palliative care.
            </TypographyP>
        </div>
    )
}
