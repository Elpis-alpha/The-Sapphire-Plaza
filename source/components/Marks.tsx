import { SVGProps } from "react"

/** The house mark: a brilliant-cut stone seen from the side. */
export const Gem = ({ className = "", ...rest }: SVGProps<SVGSVGElement>) => (
	<svg viewBox="0 0 32 28" fill="none" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" aria-hidden className={className} {...rest}>
		<path pathLength={1} d="M9 2h14l7 8-14 16L2 10l7-8Z" />
		<path pathLength={1} d="M2 10h28" />
		<path pathLength={1} d="M9 2l3 8 4-8 4 8 3-8" />
		<path pathLength={1} d="M12 10l4 16 4-16" />
	</svg>
)

export const Arrow = ({ className = "", direction = "right" }: { className?: string; direction?: "right" | "down" | "up-right" }) => (
	<svg
		viewBox="0 0 20 10" width="20" height="10" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden
		className={`arrow shrink-0 ${direction === "down" ? "rotate-90" : direction === "up-right" ? "-rotate-45" : ""} ${className}`}
	>
		<path d="M0 5h18.5M14.5 1l4 4-4 4" />
	</svg>
)

export const Eyebrow = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
	<p className={`eyebrow flex items-center gap-3 text-muted ${className}`}>
		<Gem className="h-3 w-3.5 text-accent" />
		<span>{children}</span>
	</p>
)
