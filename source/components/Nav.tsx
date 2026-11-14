import { useEffect, useRef, useState } from "react"
import { CURTAIN, onAnchorClick, pauseScroll, resumeScroll } from "../lib/motion"
import { usePlazaTime } from "../lib/plaza-time"
import { NAV_LINKS, SITE } from "../lib/site"
import { Arrow, Gem } from "./Marks"

const Nav = () => {
	const [open, setOpen] = useState(false)
	const [solid, setSolid] = useState(false)
	const [hidden, setHidden] = useState(false)
	const [arrived, setArrived] = useState(false)
	const lastY = useRef(0)
	const { clock, when, start, end } = usePlazaTime()

	// Glass once the hero is behind us; tuck away while reading down, return on the way up.
	useEffect(() => {
		const onScroll = () => {
			const y = window.scrollY
			setSolid(y > 48)
			if (Math.abs(y - lastY.current) > 6) {
				setHidden(y > lastY.current && y > window.innerHeight * 0.8)
				lastY.current = y
			}
		}
		onScroll()
		window.addEventListener("scroll", onScroll, { passive: true })
		const timer = window.setTimeout(() => setArrived(true), CURTAIN * 1000 + 500)
		return () => {
			window.removeEventListener("scroll", onScroll)
			window.clearTimeout(timer)
		}
	}, [])

	useEffect(() => {
		if (!open) return
		pauseScroll()
		document.body.style.overflow = "hidden"
		const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false)
		window.addEventListener("keydown", onKey)
		return () => {
			resumeScroll()
			document.body.style.overflow = ""
			window.removeEventListener("keydown", onKey)
		}
	}, [open])

	const follow = (event: React.MouseEvent<HTMLAnchorElement>) => {
		if (open) {
			// Release the scroll lock now – the page has to be free to travel.
			setOpen(false)
			resumeScroll()
			document.body.style.overflow = ""
		}
		onAnchorClick(event)
	}

	return (
		<>
			<header
				className="nav-shell fixed inset-x-0 top-0 z-50 text-bone"
				data-solid={solid && !open}
				data-hidden={hidden && !open}
			>
				<div
					className={`flex h-[4.5rem] items-center justify-between gap-6 px-gutter transition-[opacity,transform] duration-1000 ease-glide motion-reduce:transition-none ${arrived ? "" : "motion-safe:-translate-y-3 motion-safe:opacity-0"}`}
				>
					<a href="#home" onClick={follow} className="flex items-center gap-3" aria-label={`${SITE.name} – back to top`}>
						<Gem className="h-5 w-6 text-lamp" />
						<span className="eyebrow !tracking-[0.3em]">
							<span className="hidden xs:inline">The </span>Sapphire Plaza
						</span>
					</a>

					<nav aria-label="Primary" className="absolute left-1/2 hidden -translate-x-1/2 lg:block">
						<ul className="flex items-center gap-10">
							{NAV_LINKS.map(link => (
								<li key={link.href}>
									<a href={link.href} onClick={follow} className="underline-link text-[0.9rem] tracking-wide">
										{link.label}
									</a>
								</li>
							))}
						</ul>
					</nav>

					<div className="flex items-center gap-5">
						<p className="eyebrow tabular hidden items-center gap-2.5 text-bone/70 xl:flex" suppressHydrationWarning>
							<span className="pulse" /> Plaza {clock ?? "––:––"}
						</p>
						<a href="#book" onClick={follow} className="btn btn-outline hidden !min-h-[2.75rem] !px-5 text-bone sm:inline-flex" style={{ ["--line" as string]: "rgba(243,241,234,.4)", ["--fg" as string]: "#f3f1ea", ["--bg" as string]: "#05081a" }}>
							Reserve
						</a>
						<button
							type="button"
							className="group relative -mr-2 grid h-11 w-11 place-items-center lg:hidden"
							aria-expanded={open}
							aria-controls="menu"
							aria-label={open ? "Close menu" : "Open menu"}
							onClick={() => setOpen(value => !value)}
						>
							<span className={`absolute h-px w-6 bg-current transition-transform duration-500 ease-cut ${open ? "rotate-45" : "-translate-y-[4px]"}`} />
							<span className={`absolute h-px w-6 bg-current transition-transform duration-500 ease-cut ${open ? "-rotate-45" : "translate-y-[4px]"}`} />
						</button>
					</div>
				</div>
			</header>

			<div id="menu" className="menu-sheet fixed inset-0 z-40 flex flex-col bg-abyss px-gutter pb-8 pt-28 text-bone lg:hidden" data-open={open} aria-hidden={!open}>
				<nav aria-label="Menu" className="flex-1">
					<ul>
						{NAV_LINKS.map((link, index) => (
							<li key={link.href} className="menu-item border-b border-bone/15" style={{ ["--i" as string]: index }}>
								<a href={link.href} onClick={follow} tabIndex={open ? 0 : -1} className="flex items-baseline justify-between gap-4 py-5">
									<span className="display text-[clamp(2.5rem,11vw,4rem)]">{link.label}</span>
									<span className="eyebrow whitespace-nowrap text-bone/55">{link.hint}</span>
								</a>
							</li>
						))}
					</ul>
				</nav>
				<div className="menu-item mt-8 flex items-end justify-between gap-6" style={{ ["--i" as string]: NAV_LINKS.length }}>
					<p className="eyebrow whitespace-nowrap leading-loose text-bone/70">
						{when}&rsquo;s blue hour<br />
						<span className="tabular text-lamp">{start} – {end}</span>
					</p>
					<a href="#book" onClick={follow} tabIndex={open ? 0 : -1} className="btn btn-lamp">
						Reserve <Arrow />
					</a>
				</div>
			</div>
		</>
	)
}

export default Nav
