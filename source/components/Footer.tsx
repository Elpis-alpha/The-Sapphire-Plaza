import { onAnchorClick } from "../lib/motion"
import { usePlazaTime } from "../lib/plaza-time"
import { NAV_LINKS, SITE } from "../lib/site"
import { PLAZA } from "../lib/sun"
import { Arrow, Gem } from "./Marks"

const Footer = () => {
	const { clock, when, start, end } = usePlazaTime()
	const follow = [
		{ label: "Instagram", href: SITE.instagram },
		{ label: "Facebook", href: SITE.facebook },
		{ label: "Twitter", href: SITE.twitter },
	]

	return (
		<footer data-theme="limestone" className="relative overflow-hidden px-gutter pb-8 pt-10">
			<div className="grid gap-x-10 gap-y-12 border-t border-line pt-12 sm:grid-cols-2 lg:grid-cols-12">
				<div className="lg:col-span-5">
					<p className="display max-w-[16ch] text-[clamp(2rem,3.4vw,3.5rem)] leading-[1.02]">
						The sky will not <em className="text-accent">wait for you.</em>
					</p>
					<a href="#book" onClick={onAnchorClick} className="btn mt-9">
						Reserve a stay <Arrow />
					</a>
				</div>

				<div className="lg:col-span-3">
					<h2 className="eyebrow text-muted">Find us</h2>
					<address className="mt-5 not-italic leading-relaxed">
						The Sapphire Plaza<br />
						Lagoon Road, {PLAZA.place}<br />
						<span className="tabular text-muted">{PLAZA.coords}</span>
					</address>
					<p className="mt-5 leading-relaxed">
						<a href={`mailto:${SITE.email}`} className="underline-link">{SITE.email}</a>
					</p>
				</div>

				<nav aria-label="Footer" className="lg:col-span-2">
					<h2 className="eyebrow text-muted">The house</h2>
					<ul className="mt-5 space-y-2.5">
						{NAV_LINKS.map(link => (
							<li key={link.href}>
								<a href={link.href} onClick={onAnchorClick} className="underline-link">{link.label}</a>
							</li>
						))}
						<li><a href="#book" onClick={onAnchorClick} className="underline-link">Reservations</a></li>
					</ul>
				</nav>

				<div className="lg:col-span-2">
					<h2 className="eyebrow text-muted">Follow</h2>
					<ul className="mt-5 space-y-2.5">
						{follow.map(link => (
							<li key={link.label}>
								<a href={link.href} target="_blank" rel="noopener noreferrer" className="underline-link">{link.label}</a>
							</li>
						))}
					</ul>
				</div>
			</div>

			<p className="display mt-20 select-none whitespace-nowrap text-center text-[13.4vw] leading-[0.82] text-sapphire-deep md:mt-28" aria-hidden>
				Sapphire <em>Plaza</em>
			</p>

			<div className="eyebrow mt-10 grid gap-x-10 gap-y-4 border-t border-line pt-6 text-muted sm:grid-cols-2 xl:grid-cols-[auto_1fr_auto_auto] xl:items-center">
				<p className="flex items-center gap-3">
					<Gem className="h-3.5 w-4 text-accent" />
					© {new Date().getFullYear()} {SITE.name}
				</p>
				<p className="tabular xl:text-center" suppressHydrationWarning>
					Plaza time {clock ?? "––:––"} <span className="mx-2 text-accent">◆</span> {when}&rsquo;s blue hour {start} – {end}
				</p>
				<p>
					A concept hotel, designed and built by{" "}
					<a href={SITE.maker.url} target="_blank" rel="noopener noreferrer" className="underline-link text-fg">{SITE.maker.name}</a>
				</p>
				<a href="#home" onClick={onAnchorClick} className="flex items-center gap-3 text-fg">
					Back to dusk <Arrow className="-rotate-90" />
				</a>
			</div>
		</footer>
	)
}

export default Footer
