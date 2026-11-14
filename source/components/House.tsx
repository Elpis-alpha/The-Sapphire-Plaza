import Image from "next/image"
import { useRef } from "react"
import villaPhoto from "@/public/images/hours/villa.jpg"
import poolPhoto from "@/public/images/hours/pool-portrait.jpg"
import { gsap, MOTION_OK, SplitText, useGsap } from "../lib/motion"
import { Eyebrow } from "./Marks"

const NOTES = [
	{
		title: "The house",
		body: "Low roofs, deep eaves, and walls that fold away. It was drawn in the island's tropical-modern tradition, where the only thing between you and the weather is shade.",
	},
	{
		title: "The water",
		body: "A thirty-eight metre pool on the lagoon's edge, tiled dark and lit from beneath, so that when the sky comes down in the evening it has somewhere to land.",
	},
	{
		title: "The pace",
		body: "No lobby music and no buffet queue. Tea is at four. Everything else happens when you would like it to.",
	},
]

const House = ({ roomCount }: { roomCount: number }) => {
	const root = useRef<HTMLElement>(null)

	const figures = [
		{ value: 9, unit: "min", label: "of blue hour, on a clear evening" },
		{ value: 38, unit: "m", label: "of pool, lit from beneath" },
		{ value: roomCount, unit: "", label: "kinds of room, no two alike" },
		{ value: 1974, unit: "", label: "the year the first pavilion went up" },
	]

	useGsap(() => {
		const media = gsap.matchMedia()
		media.add(MOTION_OK, () => {
			// The statement lights up word by word as it is read.
			SplitText.create(".house-statement", {
				type: "words",
				autoSplit: true,
				onSplit: self =>
					gsap.from(self.words, {
						opacity: 0.14,
						stagger: 0.1,
						ease: "none",
						scrollTrigger: { trigger: ".house-statement", start: "top 78%", end: "bottom 45%", scrub: 0.4 },
					}),
			})

			gsap.utils.toArray<HTMLElement>(".house-figure").forEach(node => {
				const target = Number(node.dataset.value)
				const counter = { value: target > 1000 ? target - 60 : 0 }
				gsap.to(counter, {
					value: target,
					duration: 2,
					ease: "power3.out",
					onUpdate: () => { node.textContent = Math.round(counter.value).toString() },
					scrollTrigger: { trigger: node, start: "top 90%", once: true },
				})
			})
		})
	}, root, [roomCount])

	return (
		<section ref={root} id="about" data-theme="ink" className="relative px-gutter pb-28 pt-28 md:pb-40 md:pt-44">
			<Eyebrow>The House</Eyebrow>

			<p className="house-statement display mt-10 max-w-[19ch] text-[clamp(2.1rem,5.4vw,5.75rem)] leading-[1.04] md:mt-14">
				Every evening, for about nine minutes, the sky over the lagoon turns the exact blue of the stone this island is known for.{" "}
				<em className="text-accent">We built a house to watch it from.</em>
			</p>

			<div className="mt-24 grid items-start gap-x-[6vw] gap-y-16 md:mt-40 lg:grid-cols-12">
				<figure className="lg:sticky lg:top-[11vh] lg:col-span-6" data-reveal="frame">
					<div className="cut-lg relative aspect-[4/5] overflow-hidden bg-abyss lg:max-h-[78vh] lg:w-full">
						<Image
							src={villaPhoto}
							alt="A timber-lined garden room with a low platform bed, doors open to the courtyard."
							fill
							sizes="(min-width: 1024px) 46vw, 92vw"
							placeholder="blur"
							data-parallax="8"
							className="scale-[1.18] object-cover"
						/>
					</div>
					<figcaption className="eyebrow mt-4 flex justify-between text-muted">
						<span>Garden room, east wing</span>
						<span>Fig. 01</span>
					</figcaption>
				</figure>

				<div className="flex flex-col justify-between gap-16 lg:col-span-6 lg:gap-[22vh] lg:pb-[6vh] lg:pt-[14vh]">
					<ul className="max-w-[34rem]">
						{NOTES.map(note => (
							<li key={note.title} className="grid gap-x-8 gap-y-2 border-t border-line py-7 sm:grid-cols-[8.5rem_1fr]" data-reveal="fade">
								<h3 className="display text-2xl italic">{note.title}</h3>
								<p className="leading-relaxed text-muted">{note.body}</p>
							</li>
						))}
					</ul>

					<figure className="ml-auto w-[min(100%,23rem)]" data-reveal="frame">
						<div className="cut-lg relative aspect-square overflow-hidden bg-abyss">
							<Image
								src={poolPhoto}
								alt="The pool court after dark, its tiled floor glowing blue under the pavilion lights."
								fill
								sizes="(min-width: 1024px) 23rem, 80vw"
								placeholder="blur"
								data-parallax="10"
								className="scale-[1.22] object-cover"
							/>
						</div>
						<figcaption className="eyebrow mt-4 flex justify-between text-muted">
							<span>Pool court, 18:20</span>
							<span>Fig. 02</span>
						</figcaption>
					</figure>
				</div>
			</div>

			<div className="mt-24 grid grid-cols-2 gap-x-8 gap-y-12 border-t border-line pt-10 md:mt-36 lg:grid-cols-4">
				{figures.map(figure => (
					<div key={figure.label} data-reveal="fade">
						<p className="display tabular text-[clamp(3rem,6.4vw,6.5rem)] leading-none">
							<span className="house-figure" data-value={figure.value}>{figure.value}</span>
							{figure.unit && <span className="ml-1.5 text-[0.32em] italic text-accent">{figure.unit}</span>}
						</p>
						<p className="mt-4 max-w-[22ch] text-sm leading-snug text-muted">
							{figure.label.replace(/^./, c => c.toUpperCase())}
						</p>
					</div>
				))}
			</div>
		</section>
	)
}

export default House
