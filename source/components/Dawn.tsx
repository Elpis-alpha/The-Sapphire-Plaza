import Image from "next/image"
import dawnPhoto from "@/public/images/hours/first-light.jpg"
import { usePlazaTime } from "../lib/plaza-time"

/** The night is over: a full-bleed first light before the page turns to day. */
const Dawn = () => {
	const { sunrise } = usePlazaTime()
	return (
		<section aria-label="First light" className="relative h-[70vh] min-h-[420px] overflow-hidden md:h-[92vh]">
			<Image
				src={dawnPhoto}
				alt="First light over the beach below the house: pale surf and a low sun behind soft cloud."
				fill
				// Painted at 1.28x (scale-[1.28]) and cropped by height on phones, so the
				// box width understates what is on screen.
				sizes="(min-width: 768px) 135vw, 300vw"
				quality={90}
				placeholder="blur"
				data-parallax="12"
				className="scale-[1.28] object-cover"
			/>
			<div className="absolute inset-0 bg-gradient-to-b from-abyss via-transparent to-transparent opacity-90" />
			<div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#efe8db] to-transparent" />
			<div className="relative flex h-full flex-col items-center justify-center px-gutter text-center text-white">
				<p className="display tabular text-[clamp(5rem,17vw,17rem)] leading-[0.8] drop-shadow-[0_2px_40px_rgba(5,8,26,.35)]" data-reveal="lines" suppressHydrationWarning>
					{sunrise}
				</p>
				<p className="display mt-6 text-[clamp(1.5rem,2.6vw,2.75rem)] italic drop-shadow-[0_1px_20px_rgba(5,8,26,.5)]" data-reveal="fade">
					First light. Coffee is already on your terrace.
				</p>
			</div>
		</section>
	)
}

export default Dawn
