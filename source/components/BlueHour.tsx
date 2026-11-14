import { usePlazaTime } from "../lib/plaza-time"

/** Tonight's blue hour and the time at the Plaza, live. */
const BlueHour = ({ className = "" }: { className?: string }) => {
	const { when, start, end, clock, caption, status } = usePlazaTime()
	return (
		<div className={`flex items-stretch gap-6 sm:gap-8 ${className}`}>
			<div>
				<p className="eyebrow flex items-center gap-2.5 text-white/75">
					<span className="pulse" />
					{status.phase === "during" ? "The blue hour" : `${when}'s blue hour`}
				</p>
				<p className="display tabular mt-2 text-[clamp(1.75rem,2.6vw,2.5rem)] leading-none">
					{start}<span className="mx-2 opacity-50">–</span>{end}
				</p>
				<p className="eyebrow mt-2 text-lamp" aria-live="polite">{caption}</p>
			</div>
			<div className="border-l border-white/25 pl-6 sm:pl-8">
				<p className="eyebrow text-white/75">Plaza time</p>
				<p className="display tabular mt-2 text-[clamp(1.75rem,2.6vw,2.5rem)] leading-none" suppressHydrationWarning>
					{clock ?? "––:––"}
				</p>
				<p className="eyebrow mt-2 text-white/60">UTC +5:30</p>
			</div>
		</div>
	)
}

export default BlueHour
