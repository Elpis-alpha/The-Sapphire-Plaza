import { RefObject } from "react"
import { gsap, MOTION_OK, SplitText, useGsap } from "./motion"

/**
 * Page-wide scroll choreography, driven by data attributes so sections stay
 * declarative:
 *
 *   data-reveal="lines"   headline rises line by line from behind a mask
 *   data-reveal="fade"    element drifts up into place
 *   data-reveal="frame"   image frame unveils from the bottom edge
 *   data-parallax="8"     element drifts ±8% against the scroll
 *
 * Without JavaScript, or with reduced motion, everything is simply visible.
 */
export const useReveals = (scope: RefObject<HTMLElement>) => {
	useGsap(() => {
		const media = gsap.matchMedia()
		media.add(MOTION_OK, () => {
			gsap.utils.toArray<HTMLElement>('[data-reveal="lines"]').forEach(node => {
				SplitText.create(node, {
					type: "lines",
					mask: "lines",
					autoSplit: true,
					onSplit: self =>
						gsap.from(self.lines, {
							yPercent: 112,
							duration: 1.4,
							stagger: 0.11,
							scrollTrigger: { trigger: node, start: "top 88%", once: true },
						}),
				})
			})

			gsap.utils.toArray<HTMLElement>('[data-reveal="fade"]').forEach(node => {
				gsap.from(node, {
					opacity: 0,
					y: 34,
					duration: 1.3,
					scrollTrigger: { trigger: node, start: "top 90%", once: true },
				})
			})

			gsap.utils.toArray<HTMLElement>('[data-reveal="frame"]').forEach(node => {
				gsap.from(node.firstElementChild, {
					clipPath: "inset(100% 0% 0% 0%)",
					duration: 1.6,
					ease: "expo.inOut",
					clearProps: "clipPath",
					scrollTrigger: { trigger: node, start: "top 85%", once: true },
				})
			})

			gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach(node => {
				const amount = Number(node.dataset.parallax) || 8
				gsap.fromTo(
					node,
					{ yPercent: -amount },
					{
						yPercent: amount,
						ease: "none",
						scrollTrigger: { trigger: node.parentElement, start: "top bottom", end: "bottom top", scrub: true },
					}
				)
			})
		})
	}, scope)
}
