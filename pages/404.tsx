import Head from "next/head"
import Link from "next/link"
import { Arrow, Gem } from "@/source/components/Marks"
import { SITE } from "@/source/lib/site"

export default function NotFound() {
	return (
		<>
			<Head>
				<title>{`Not found — ${SITE.name}`}</title>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<meta name="robots" content="noindex" />
			</Head>
			<main data-theme="ink" className="sky-night relative grid min-h-[100svh] place-items-center overflow-hidden px-gutter text-center">
				<div className="stars absolute inset-0" aria-hidden />
				<div className="relative">
					<Gem className="mx-auto h-9 w-10 text-accent" />
					<p className="eyebrow mt-8 text-muted">Room 404</p>
					<h1 className="display mt-6 text-[clamp(3rem,9vw,9rem)]">
						This room <br />
						<em>does not exist.</em>
					</h1>
					<p className="mx-auto mt-8 max-w-[36ch] text-lg leading-relaxed text-muted">
						You have wandered down a corridor we never built. The rest of the house is this way.
					</p>
					<Link href="/" className="btn mt-10">
						Back to the house <Arrow />
					</Link>
				</div>
			</main>
		</>
	)
}
