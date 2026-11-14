import { DependencyList, RefObject, useEffect, useLayoutEffect } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SplitText } from "gsap/SplitText"
import type Lenis from "lenis"

if (typeof window !== "undefined") {
	gsap.registerPlugin(ScrollTrigger, SplitText)
	gsap.defaults({ ease: "expo.out", duration: 1.1 })
}

export { gsap, ScrollTrigger, SplitText }

/** How long the opening curtain holds before it lifts (seconds). Mirrors the CSS. */
export const CURTAIN = 1.35

export const MOTION_OK = "(prefers-reduced-motion: no-preference)"
export const DESKTOP = "(min-width: 1024px)"

export const prefersMotion = () => typeof window !== "undefined" && window.matchMedia(MOTION_OK).matches

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect

/**
 * Run GSAP code scoped to an element, and tear every tween, ScrollTrigger and
 * SplitText down again on unmount (or when deps change).
 */
export const useGsap = (setup: (context: gsap.Context) => void, scope: RefObject<Element>, deps: DependencyList = []) => {
	useIsoLayoutEffect(() => {
		const context = gsap.context(setup, scope.current ?? undefined)
		return () => context.revert()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, deps)
}

// ── Smooth scrolling ────────────────────────────────────────────────────────

let lenis: Lenis | null = null

export const setLenis = (instance: Lenis | null) => { lenis = instance }
export const pauseScroll = () => lenis?.stop()
export const resumeScroll = () => lenis?.start()

/** Scroll to an in-page anchor such as `#rooms`, updating the URL hash. */
export const scrollToHash = (hash: string) => {
	const target = hash === "#home" ? document.body : document.querySelector<HTMLElement>(hash)
	if (!target) return
	window.history.replaceState(null, "", hash === "#home" ? window.location.pathname : hash)
	if (lenis) {
		lenis.scrollTo(hash === "#home" ? 0 : target, { duration: 1.6, easing: t => 1 - Math.pow(1 - t, 4) })
	} else {
		target.scrollIntoView({ behavior: prefersMotion() ? "smooth" : "auto" })
	}
}

/** Click handler for anchor links. */
export const onAnchorClick = (event: { preventDefault(): void; currentTarget: HTMLAnchorElement }) => {
	const href = event.currentTarget.getAttribute("href") ?? ""
	const hash = href.slice(href.indexOf("#"))
	if (!hash.startsWith("#")) return
	event.preventDefault()
	scrollToHash(hash)
}
