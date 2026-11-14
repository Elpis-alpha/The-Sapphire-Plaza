import { useState } from "react"
import { Faq as FaqEntry } from "../lib/sanity"
import { SITE } from "../lib/site"
import { Arrow, Eyebrow } from "./Marks"

const Faq = ({ faqs }: { faqs: FaqEntry[] }) => {
	const [open, setOpen] = useState<string | null>(faqs[0]?._id ?? null)

	return (
		<section id="faq" data-theme="deep" className="relative px-gutter pb-28 pt-28 md:pb-40 md:pt-40">
			<div className="grid gap-x-[6vw] gap-y-14 lg:grid-cols-12">
				<header className="lg:col-span-5">
					<div className="lg:sticky lg:top-[16vh]">
						<Eyebrow>Questions</Eyebrow>
						<h2 className="display mt-8 text-[clamp(2.75rem,5.8vw,6.25rem)]" data-reveal="lines">
							Before <br className="hidden lg:block" />
							you <em>arrive.</em>
						</h2>
						<p className="mt-8 max-w-[34ch] leading-relaxed text-muted" data-reveal="fade">
							The things guests most often ask us. If yours is not here, the front desk answers at every hour.
						</p>
						<a href={`mailto:${SITE.email}`} className="text-link mt-8" data-reveal="fade">
							Write to the desk <Arrow direction="up-right" />
						</a>
					</div>
				</header>

				<div className="lg:col-span-7">
					{faqs.length === 0 && <p className="display border-t border-line pt-8 text-2xl italic text-muted">Nothing has been asked yet.</p>}
					<ul className="border-b border-line">
						{faqs.map((faq, index) => {
							const isOpen = open === faq._id
							return (
								<li key={faq._id} className="faq-item border-t border-line" data-open={isOpen} data-reveal="fade">
									<h3>
										<button
											type="button"
											id={`faq-q-${index}`}
											aria-expanded={isOpen}
											aria-controls={`faq-a-${index}`}
											onClick={() => setOpen(isOpen ? null : faq._id)}
											className="group grid w-full grid-cols-[minmax(0,1fr)_2.75rem] items-center gap-x-4 py-7 text-left sm:grid-cols-[2.75rem_minmax(0,1fr)_2.75rem] md:py-8"
										>
											<span className="eyebrow tabular hidden text-muted sm:block">{(index + 1).toString().padStart(2, "0")}</span>
											<span className="display text-[clamp(1.35rem,2.1vw,2.1rem)] leading-tight transition-transform duration-700 ease-glide group-hover:translate-x-2">
												{faq.question}
											</span>
											<span className="faq-sign relative ml-auto h-11 w-11 rounded-full border border-line transition-colors duration-500 group-hover:border-accent group-hover:text-accent" />
										</button>
									</h3>
									<div id={`faq-a-${index}`} role="region" aria-labelledby={`faq-q-${index}`} className="faq-panel">
										<div>
											<p className="max-w-[54ch] pb-9 pr-4 sm:pl-[3.75rem] text-lg leading-relaxed text-muted">{faq.answer}</p>
										</div>
									</div>
								</li>
							)
						})}
					</ul>
				</div>
			</div>
		</section>
	)
}

export default Faq
