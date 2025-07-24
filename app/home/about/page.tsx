import { TypographyH1, TypographyP } from '@/components/ui/typography'

export default function AboutPage() {
	return (
		<div className='p-4 max-w-[1400px] mx-auto'>
			<TypographyH1 className='text-2xl font-bold mb-4'>About COMPASS</TypographyH1>

			<TypographyP>
				The COMPASS project aims to improve patient-reported outcomes
				and care experiences across thecancer care continuum in India
				through a Community-Oriented Model of Patient Navigation
				System.This hybrid implementation study addresses the rising
				cancer burden in India, where fragmented carepathways and late
				diagnoses contribute to high mortality rates.
			</TypographyP>
			<TypographyP>
				The project's core concept involves introducing and integrating
				both community and hospitalnavigators to create a conducive
				environment for patient navigation through the health care
				system.Community navigators will be trained lay workers
				providing informational and emotional support,while hospital
				navigators will be junior nurses or social workers coordinating
				care and decisionmaking. This dual approach aims to bridge gaps
				in the cancer care pathway from screening tosurvivorship and
				palliative care.
			</TypographyP>
		</div>
	)
}
