import type { GetStaticProps } from "next"
import Head from "next/head"
import { useRef, useState } from "react"
import Dawn from "@/source/components/Dawn"
import Faq from "@/source/components/Faq"
import Footer from "@/source/components/Footer"
import Hero from "@/source/components/Hero"
import Hours from "@/source/components/Hours"
import House from "@/source/components/House"
import { Gem } from "@/source/components/Marks"
import Nav from "@/source/components/Nav"
import Reserve from "@/source/components/Reserve"
import Rooms from "@/source/components/Rooms"
import { scrollToHash } from "@/source/lib/motion"
import { PlazaTimeProvider } from "@/source/lib/plaza-time"
import { useReveals } from "@/source/lib/reveals"
import { Room, sortRooms, toRoom } from "@/source/lib/rooms"
import { Faq as FaqEntry, fetchContent } from "@/source/lib/sanity"
import { SITE } from "@/source/lib/site"

type Props = { rooms: Room[]; faqs: FaqEntry[]; builtAt: string }

export default function Home({ rooms, faqs, builtAt }: Props) {
	const main = useRef<HTMLElement>(null)
	const [chosen, setChosen] = useState<{ name: string; at: number } | null>(null)
	useReveals(main)

	const reserve = (room: Room) => {
		setChosen({ name: room.name, at: Date.now() })
		scrollToHash("#book")
	}

	const title = `${SITE.name} — ${SITE.tagline}`
	const image = `${SITE.url}/images/og-image.jpg`

	return (
		<PlazaTimeProvider builtAt={builtAt}>
			<Head>
				<title>{title}</title>
				<meta name="description" content={SITE.description} />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="canonical" href={`${SITE.url}/`} />
				<meta property="og:title" content={title} />
				<meta property="og:description" content={SITE.description} />
				<meta property="og:url" content={`${SITE.url}/`} />
				<meta property="og:type" content="website" />
				<meta property="og:locale" content="en_US" />
				<meta property="og:image" content={image} />
				<meta property="og:image:width" content="1200" />
				<meta property="og:image:height" content="630" />
				<meta property="og:image:type" content="image/jpeg" />
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:site" content="@elpis_alpha" />
				<meta name="twitter:creator" content="@elpis_alpha" />
				<meta name="twitter:title" content={title} />
				<meta name="twitter:description" content={SITE.description} />
				<meta name="twitter:image" content={image} />
			</Head>

			<div className="curtain" aria-hidden>
				<div className="flex flex-col items-center gap-6">
					<Gem className="curtain-gem h-12 w-14 text-lamp" />
					<p className="curtain-word eyebrow !tracking-[0.42em]">The Sapphire Plaza</p>
				</div>
			</div>

			<a href="#about" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[110] focus:bg-lamp focus:px-4 focus:py-3 focus:text-ink">
				Skip to content
			</a>

			<Nav />
			<main ref={main} className="relative">
				<Hero />
				<House roomCount={rooms.length} />
				<Hours />
				<Rooms rooms={rooms} onReserve={reserve} />
				<Faq faqs={faqs} />
				<Dawn />
				<Reserve rooms={rooms} chosen={chosen} />
			</main>
			<Footer />
		</PlazaTimeProvider>
	)
}

export const getStaticProps: GetStaticProps<Props> = async () => {
	const { rooms, faqs } = await fetchContent()
	return {
		props: {
			rooms: sortRooms(rooms.map(toRoom)),
			faqs,
			builtAt: new Date().toISOString(),
		},
		// Pick up edits made in the Sanity studio without a redeploy.
		revalidate: 600,
	}
}
