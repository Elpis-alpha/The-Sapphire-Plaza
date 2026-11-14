import "@/styles/globals.css"
import type { AppProps } from "next/app"
import { Bodoni_Moda, DM_Mono, Hanken_Grotesk } from "next/font/google"
import { useEffect } from "react"
import Lenis from "lenis"
import { gsap, prefersMotion, ScrollTrigger, setLenis } from "@/source/lib/motion"

// Display: a sharp, high-contrast didone – cut like the stone the house is named for.
const display = Bodoni_Moda({ subsets: ["latin"], style: ["normal", "italic"], axes: ["opsz"], variable: "--font-display", display: "swap", adjustFontFallback: false })
const sans = Hanken_Grotesk({ subsets: ["latin"], variable: "--font-sans", display: "swap" })
// Times, coordinates and rates are set in mono, like entries in a ledger.
const mono = DM_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono", display: "swap" })

export default function App({ Component, pageProps }: AppProps) {
	useEffect(() => {
		// The font variables live on <html> so that fixed overlays inherit them too.
		document.documentElement.classList.add(display.variable, sans.variable, mono.variable)
	}, [])

	useEffect(() => {
		if (!prefersMotion()) return
		const lenis = new Lenis({ lerp: 0.105, wheelMultiplier: 0.95 })
		setLenis(lenis)
		lenis.on("scroll", ScrollTrigger.update)
		const tick = (time: number) => lenis.raf(time * 1000)
		gsap.ticker.add(tick)
		gsap.ticker.lagSmoothing(0)
		const refresh = () => ScrollTrigger.refresh()
		window.addEventListener("load", refresh)
		document.fonts?.ready.then(refresh)
		return () => {
			window.removeEventListener("load", refresh)
			gsap.ticker.remove(tick)
			lenis.destroy()
			setLenis(null)
		}
	}, [])

	return (
		<div className={`${display.variable} ${sans.variable} ${mono.variable} font-sans`}>
			<Component {...pageProps} />
			<div className="grain" aria-hidden />
		</div>
	)
}
