import { TypographyH1, TypographyP } from '@/components/ui/typography'

export default function ContactPage() {
	return (
		<div className='max-w-3xl mx-auto p-4'>
			<TypographyH1 className='text-2xl font-bold mb-4 text-[#003366]'>
				Contact Us
			</TypographyH1>

			<TypographyP className='mb-4 text-gray-700 '>
				For any queries or technical issues related to the COMPASS
				Portal, please reach out to us using the following contact
				information:
			</TypographyP>
			<div className='space-y-4'>
				<div>
					<TypographyP className='font-semibold '>
						Institution:
					</TypographyP>
					<div>
						<TypographyP>
							Jawaharlal Institute of Postgraduate Medical
							Education and Research (JIPMER)
						</TypographyP>
					</div>
				</div>

				<div>
					<TypographyP className='font-semibold'>
						Address:
					</TypographyP>
					<div>
						<TypographyP>
							JIPMER Campus Rd, Gorimedu, Dhanvantari Nagar,
							Puducherry - 605006
						</TypographyP>
					</div>
				</div>

				<div>
					<TypographyP className='font-semibold'>Email:</TypographyP>
					<div>
						<TypographyP>compass-support@jipmer.edu.in</TypographyP>
					</div>
				</div>

				<div>
					<TypographyP className='font-semibold'>Phone:</TypographyP>
					<div>
						<TypographyP>+91 2222 2222</TypographyP>
					</div>
				</div>
			</div>
		</div>
	)
}
