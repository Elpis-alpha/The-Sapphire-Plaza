import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react"
import { blueHourStatus, BlueHourStatus, Evening, formatCountdown, plazaClock } from "./sun"

type PlazaTime = {
	/** Null until the page has hydrated – the clock is only shown live. */
	now: Date | null
	status: BlueHourStatus
	/** The next blue hour a guest could still catch. */
	next: Evening
	/** "Tonight" or "Tomorrow". */
	when: string
	start: string
	end: string
	sunrise: string
	clock: string | null
	/** A short human sentence about where we are relative to the blue hour. */
	caption: string
}

const Context = createContext<PlazaTime | null>(null)

export const PlazaTimeProvider = ({ builtAt, children }: { builtAt: string; children: ReactNode }) => {
	const [now, setNow] = useState<Date | null>(null)

	useEffect(() => {
		const tick = () => setNow(new Date())
		tick()
		const id = window.setInterval(tick, 10_000)
		return () => window.clearInterval(id)
	}, [])

	// Until hydration, render from the build timestamp so server and client agree.
	const minute = Math.floor((now ?? new Date(builtAt)).getTime() / 60_000)

	const value = useMemo<PlazaTime>(() => {
		const reference = new Date(minute * 60_000)
		const status = blueHourStatus(reference)
		const next = status.phase === "after" ? status.tomorrow : status.evening
		const caption =
			status.phase === "before" ? `Begins in ${formatCountdown(status.minutesUntil)}`
			: status.phase === "during" ? `Happening now · ${status.minutesLeft} min left`
			: "Tonight's has passed"
		return {
			now,
			status,
			next,
			when: status.phase === "after" ? "Tomorrow" : "Tonight",
			start: plazaClock(next.blueStart),
			end: plazaClock(next.blueEnd),
			sunrise: plazaClock(next.sunrise),
			clock: now ? plazaClock(now) : null,
			caption,
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [minute, now === null])

	return <Context.Provider value={value}>{children}</Context.Provider>
}

export const usePlazaTime = () => {
	const value = useContext(Context)
	if (!value) throw new Error("usePlazaTime must be used inside <PlazaTimeProvider>")
	return value
}
