import QSet from "./QSet"

const FAQ = ({ faqs }: { faqs: any[] }) => {
	return (
		<section id="book" className="px-6 md:px-12 xl:px-20 w-full pt-32 flex flex-col gap-10 items-center justify-between">
			<div className="flex-1 flex flex-col items-center justify-between w-full">
				<div className="flex flex-col gap-4 w-full">
					<h3 className="font-playfair font-medium text-2xl flex items-center gap-4">
						FAQs
						<div>
							<svg height="15" className="top-[2px]" viewBox="0 0 135 25" fill="none" xmlns="http://www.w3.org/2000/svg">
								<line y1="11.5176" x2="111" y2="11.5176" stroke="#2B2644" />
								<path d="M123 0.0175781L135 12.0176L123 24.0176L111 12.0176L123 0.0175781Z" fill="#2B2644" />
							</svg>
						</div>
					</h3>
					<h2 className="font-playfair font-medium text-5xl">Frequently Asked Questions</h2>
					<p className="pt-4">Find answers to all your questions about The Sapphire Plaza in our comprehensive FAQ section. Get all the information you need before you arrive, so you can enjoy a hassle-free stay.</p>
				</div>
			</div>
			<div className="w-full flex flex-col gap-8">
				{faqs.map((faq: any) => <QSet key={faq._id} faq={faq} />)}
				{faqs.length === 0 && <div className="pb-8 font-playfair uppercase w-full text-2xl">There are no FAQs at the moment</div>}
			</div>
		</section>
	)
}
export default FAQ