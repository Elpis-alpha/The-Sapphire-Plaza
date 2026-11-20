import Image, { StaticImageData } from "next/image"
import { useRef } from "react"
import terracePhoto from "@/public/images/hours/terrace.jpg"
import palmsPhoto from "@/public/images/hours/palms.jpg"
import dinnerPhoto from "@/public/images/hours/dinner.jpg"
import barPhoto from "@/public/images/hours/bar.jpg"
import { DESKTOP, gsap, MOTION_OK, onAnchorClick, ScrollTrigger, useGsap } from "../lib/motion"
import { usePlazaTime } from "../lib/plaza-time"
import { Arrow, Gem } from "./Marks"

type Chapter = {
	key: string
	sky: "gold" | "blue" | "dusk" | "night"
	time: string
	title: string
	body: string
	where: string
	photo: StaticImageData
	alt: string
}

const BONE = "#f3f1ea"

/**
 * One evening at the Plaza, told sideways. On large screens the section pins
 * and scrolls horizontally while the sky behind it moves from gold afternoon
 * through the blue hour and into night. Elsewhere it is a simple stack, each
 * chapter under its own sky.
 */
const Hours = () => {
	const root = useRef<HTMLElement>(null)
	const { start } = usePlazaTime()

	const chapters: Chapter[] = [
		{
			key: "tea", sky: "gold", time: "16:00", title: "Tea on the terrace", where: "West terrace · daily",
			body: "Single-estate Ceylon, poured properly. The light goes gold around the second cup, and nobody is looking at a phone.",
			photo: terracePhoto, alt: "A timber terrace with two chairs and a small table, looking over treetops in late golden light.",
		},
		{
			key: "blue", sky: "blue", time: start, title: "The blue hour", where: "Poolside · every clear evening",
			body: "The pool lights come on and the sky comes down to meet them. It lasts about nine minutes. People tend to stop talking.",
			photo: palmsPhoto, alt: "Palms and white pavilions mirrored in still water under a violet-blue dusk sky.",
		},
		{
			key: "dinner", sky: "dusk", time: "19:30", title: "Dinner at Ratna", where: "Twelve tables · one seating",
			body: "Lagoon crab, black pepper, curry leaf. The kitchen cooks what the boats brought in, and no one is waiting for your table.",
			photo: dinnerPhoto, alt: "A candle-lit table mid-dinner: a plated dish, bread, and glasses of wine.",
		},
		{
			key: "bar", sky: "night", time: "22:00", title: "The Gem Bar", where: "Open until the last guest leaves",
			body: "Arrack, lime and palm treacle over hand-cut ice, and a record collection we are unreasonably proud of.",
			photo: barPhoto, alt: "An amber cocktail with a dried citrus wheel, lit against a dark bar.",
		},
	]

	useGsap(() => {
		const media = gsap.matchMedia()
		media.add(`${DESKTOP} and ${MOTION_OK}`, () => {
			const pin = root.current!.querySelector<HTMLElement>(".hours-pin")!
			const track = root.current!.querySelector<HTMLElement>(".hours-track")!
			const panels = gsap.utils.toArray<HTMLElement>("article.hours-chapter")
			const distance = () => track.scrollWidth - window.innerWidth

			const travel = gsap.to(track, {
				x: () => -distance(),
				ease: "none",
				scrollTrigger: {
					trigger: pin,
					pin: true,
					scrub: 0.5,
					start: "top top",
					end: () => `+=${distance()}`,
					invalidateOnRefresh: true,
					anticipatePin: 1,
					onRefresh: () => {
						// Place each time on the scrubber where its chapter sits centre-stage.
						const total = distance()
						gsap.utils.toArray<HTMLElement>(".hours-tick").forEach((tick, index) => {
							const panel = panels[index]
							const centred = panel.offsetLeft + panel.offsetWidth / 2 - window.innerWidth / 2
							tick.style.left = `${gsap.utils.clamp(0, 100, (centred / total) * 100)}%`
						})
					},
				},
			})

			gsap.to(".hours-progress", {
				scaleX: 1,
				ease: "none",
				scrollTrigger: { trigger: pin, start: "top top", end: () => `+=${distance()}`, scrub: 0.5 },
			})

			// Each sky fades in over the last as its chapter arrives.
			panels.forEach((panel, index) => {
				// A fresh config each time: GSAP takes ownership of the object it is given.
				const arriving = () => ({ containerAnimation: travel, trigger: panel, start: "left 78%", end: "left 34%", scrub: true })
				if (index > 0) {
					gsap.fromTo(`.hours-sky-${panel.dataset.sky}`, { opacity: 0 }, { opacity: 1, ease: "none", scrollTrigger: arriving() })
				}
				if (index === 1) {
					// Night falls: everything written in ink turns to bone.
					gsap.to(".hours-daylight", { color: BONE, ease: "none", scrollTrigger: arriving() })
				}
				if (index === 2) {
					gsap.fromTo(".hours-stars", { opacity: 0 }, { opacity: 1, ease: "none", scrollTrigger: arriving() })
				}
				gsap.fromTo(
					panel.querySelector(".hours-photo"),
					{ xPercent: -9 },
					{ xPercent: 9, ease: "none", scrollTrigger: { containerAnimation: travel, trigger: panel, start: "left right", end: "right left", scrub: true } }
				)
				gsap.from(panel.querySelectorAll(".hours-rise"), {
					y: 50,
					opacity: 0,
					duration: 1.2,
					stagger: 0.09,
					scrollTrigger: { containerAnimation: travel, trigger: panel, start: "left 72%", toggleActions: "play none none reverse" },
				})
			})

			return () => ScrollTrigger.refresh()
		})
	}, root)

	return (
		<section ref={root} id="hours" aria-label="The Hours – an evening at the Plaza" className="relative">
			<div className="hours-pin relative overflow-hidden lg:h-screen">
				<div className="hours-skies absolute inset-0" aria-hidden>
					<div className="sky-gold absolute inset-0" />
					<div className="hours-sky-blue sky-blue absolute inset-0 opacity-0" />
					<div className="hours-sky-dusk sky-dusk absolute inset-0 opacity-0" />
					<div className="hours-sky-night sky-night absolute inset-0 opacity-0" />
					<div className="hours-stars stars absolute inset-0 opacity-0" />
				</div>

				<div className="hours-track relative flex flex-col lg:h-full lg:w-max lg:flex-row lg:will-change-transform">
					<header className="hours-chapter hours-daylight flex shrink-0 flex-col justify-center px-gutter py-24 text-[#0a0f2c] lg:w-[58vw] lg:py-0" data-sky="gold">
						<p className="eyebrow flex items-center gap-3">
							<Gem className="h-3 w-3.5" /> The Hours
						</p>
						<h2 className="display mt-8 text-[clamp(3rem,7.6vw,8.5rem)]">
							An evening, <br />
							<em>hour by hour.</em>
						</h2>
						<p className="mt-8 max-w-[38ch] text-lg leading-relaxed opacity-80">
							Nothing here is scheduled, exactly. But the house does keep a certain rhythm, and most guests fall into it by the second day.
						</p>
						<p className="eyebrow mt-12 hidden items-center gap-4 lg:flex">
							Keep scrolling <Arrow />
						</p>
					</header>

					{chapters.map((chapter, index) => (
						<article
							key={chapter.key}
							data-sky={chapter.sky}
							className={`hours-chapter relative flex shrink-0 flex-col justify-center gap-10 px-gutter py-20 md:flex-row md:items-center md:gap-[5vw] md:py-28 lg:w-[76vw] lg:py-0 lg:pr-[7vw] ${index % 2 ? "lg:pl-[3vw]" : "lg:pl-0"} ${index === 0 ? "hours-daylight text-[#0a0f2c]" : "lg:text-bone"}`}
						>
							<div className={`cut-lg relative aspect-[4/5] w-full shrink-0 overflow-hidden md:w-[44%] lg:h-[68vh] lg:w-auto ${index % 2 ? "md:order-2 lg:mt-[9vh]" : "lg:-mt-[5vh]"}`}>
								<Image
									src={chapter.photo}
									alt={chapter.alt}
									fill
									// `sizes` must describe what is painted, not the frame. These are 4:5
									// frames holding landscape photos with object-cover, scaled 1.2x, so the
									// photo is as tall as the frame and ~1.5x as wide as that, times 1.2:
									//   lg: frame 68vh tall   -> 68vh * 1.5 * 1.2 = ~122vh
									//   md: frame 44vw wide   -> 55vw * 1.5 * 1.2 = ~99vw
									//   sm: frame 92vw wide   -> 115vw * 1.5 * 1.2 = ~207vw
									sizes="(min-width: 1024px) 125vh, (min-width: 768px) 100vw, 210vw"
									quality={90}
									placeholder="blur"
									className="hours-photo scale-[1.2] object-cover"
								/>
							</div>
							<div className="max-w-[30rem]">
								<p className="hours-rise display tabular text-[clamp(5rem,12.5vw,13rem)] leading-[0.8]" suppressHydrationWarning>
									{chapter.time}
								</p>
								<h3 className="hours-rise display mt-8 text-[clamp(1.9rem,2.9vw,3rem)] italic">{chapter.title}</h3>
								<p className="hours-rise mt-5 text-lg leading-relaxed opacity-80">{chapter.body}</p>
								<p className="hours-rise eyebrow mt-8 border-t border-current/20 pt-5 opacity-70" style={{ borderColor: "color-mix(in srgb, currentColor 22%, transparent)" }}>
									{chapter.where}
								</p>
							</div>
						</article>
					))}

					<footer className="hours-chapter flex shrink-0 flex-col justify-center px-gutter pb-28 pt-10 lg:w-[52vw] lg:py-0 lg:pr-[10vw] lg:text-bone" data-sky="night">
						<p className="eyebrow opacity-70">Later</p>
						<p className="display mt-8 text-[clamp(2.6rem,5.6vw,6rem)]">
							Then the night <br />
							<em>is yours.</em>
						</p>
						<a href="#rooms" onClick={onAnchorClick} className="text-link mt-12 self-start">
							Choose where it ends <Arrow direction="down" />
						</a>
					</footer>
				</div>

				<div className="hours-hud hours-daylight pointer-events-none absolute inset-x-0 bottom-0 px-gutter pb-8 text-[#0a0f2c]" aria-hidden>
					<div className="relative h-px" style={{ background: "color-mix(in srgb, currentColor 25%, transparent)" }}>
						<div className="hours-progress absolute inset-0 origin-left scale-x-0 bg-current" />
						{chapters.map(chapter => (
							<span key={chapter.key} className="hours-tick eyebrow tabular absolute bottom-0 -translate-x-1/2 pb-3" suppressHydrationWarning>
								<span className="absolute bottom-[-3px] left-1/2 h-[7px] w-px bg-current" />
								{chapter.time}
							</span>
						))}
					</div>
				</div>
			</div>
		</section>
	)
}

export default Hours
