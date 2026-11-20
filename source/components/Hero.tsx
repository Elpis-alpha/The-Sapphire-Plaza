import Image from "next/image"
import { useRef } from "react"
import heroPhoto from "@/public/images/hero.jpg"
import { CURTAIN, gsap, MOTION_OK, onAnchorClick, SplitText, useGsap } from "../lib/motion"
import { PLAZA } from "../lib/sun"
import { Arrow } from "./Marks"
import BlueHour from "./BlueHour"
import HeroWater from "./HeroWater"

/** Keeps the pavilion centred and the sky tall enough to hold the headline. */
const FOCUS: [number, number] = [0.52, 0.42]

const Hero = () => {
	const root = useRef<HTMLElement>(null)
	const photo = useRef<HTMLImageElement>(null)

	useGsap(() => {
		const media = gsap.matchMedia()
		media.add(MOTION_OK, () => {
			// Arrival: the photograph settles as the curtain lifts, then the words rise.
			const intro = gsap.timeline({ delay: CURTAIN - 0.1 })
			intro.from(".hero-media", { scale: 1.16, duration: 2.6, ease: "expo.out" }, 0)
			intro.from(".hero-veil", { opacity: 0.75, duration: 2, ease: "power2.out" }, 0)
			SplitText.create(".hero-title", {
				type: "lines",
				mask: "lines",
				autoSplit: true,
				onSplit: self => {
					const tween = gsap.from(self.lines, { yPercent: 110, duration: 1.5, stagger: 0.12, ease: "expo.out" })
					intro.add(tween, 0.45)
					return tween
				},
			})
			intro.from(".hero-fade", { opacity: 0, y: 24, duration: 1.3, stagger: 0.1 }, 1)

			// Departure: the scene sinks and dims as the page moves on.
			gsap.to(".hero-media", {
				yPercent: 14,
				ease: "none",
				scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
			})
			gsap.to(".hero-copy", {
				opacity: 0,
				y: -60,
				ease: "none",
				scrollTrigger: { trigger: root.current, start: "20% top", end: "75% top", scrub: true },
			})
		})
	}, root)

	return (
		<section ref={root} id="home" className="relative flex h-[100svh] min-h-[620px] flex-col overflow-hidden bg-ink text-white">
			<div className="absolute inset-0">
				<div className="hero-media absolute inset-0 will-change-transform">
					<Image
						ref={photo}
						src={heroPhoto}
						alt="The Sapphire Plaza at blue hour: a low pavilion glowing amber beside a pool, under a deep blue sky."
						fill
						priority
						// object-cover on a 3:2 photo: wider than 3:2 the width decides, taller
						// (every phone) the height does, so ask for the width that fills it.
						sizes="(min-aspect-ratio: 3/2) 100vw, 150vh"
						quality={90}
						placeholder="blur"
						className="object-cover"
						style={{ objectPosition: `${FOCUS[0] * 100}% ${FOCUS[1] * 100}%` }}
					/>
					<HeroWater image={photo} surface={root} focus={FOCUS} />
				</div>
				<div className="hero-veil pointer-events-none absolute inset-0 bg-ink opacity-0" />
				<div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-ink/60 to-transparent" />
				<div className="pointer-events-none absolute inset-x-0 bottom-0 h-[42%] bg-gradient-to-t from-ink/90 via-ink/45 to-transparent" />
			</div>

			<div className="hero-copy relative z-10 flex flex-1 flex-col px-gutter pb-7 pt-[clamp(6.5rem,15vh,9.5rem)] sm:pb-9">
				<div className="text-center">
					<p className="hero-fade eyebrow text-white/80">
						{PLAZA.place} <span className="mx-2 text-lamp">◆</span> <span className="whitespace-nowrap">{PLAZA.coords}</span>
					</p>
					<h1 className="hero-title display mx-auto mt-5 text-[clamp(3.1rem,8.1vw,9.75rem)] leading-[0.92] sm:mt-6">
						Where the day <br />
						turns <em className="pr-[0.06em]">sapphire.</em>
					</h1>
				</div>

				<div className="mt-auto grid items-end gap-x-10 gap-y-7 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
					<p className="hero-fade hidden max-w-[36ch] text-[0.95rem] leading-relaxed text-white/85 lg:block">
						A lagoon-side house on the island that gave the stone its name. Come for the water. Stay for the nine minutes after sunset.
					</p>
					<BlueHour className="hero-fade justify-center" />
					<div className="hero-fade flex items-center justify-center gap-7 lg:justify-end">
						<a href="#rooms" onClick={onAnchorClick} className="text-link hidden sm:inline-flex">
							See the rooms
						</a>
						<a href="#book" onClick={onAnchorClick} className="btn btn-lamp w-full sm:w-auto">
							Reserve a stay <Arrow />
						</a>
					</div>
				</div>
			</div>
		</section>
	)
}

export default Hero
