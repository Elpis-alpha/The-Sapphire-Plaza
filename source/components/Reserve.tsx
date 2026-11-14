import { FormEvent, useEffect, useId, useMemo, useState } from "react"
import { formatDollars, Room } from "../lib/rooms"
import { SITE } from "../lib/site"
import { eveningOf, parseIsoDate, plazaClock } from "../lib/sun"
import { Arrow, Eyebrow, Gem } from "./Marks"

// EmailJS – reservation requests are delivered to the front desk inbox.
const EMAIL_SERVICE = "service_vnmbxe9"
const EMAIL_TEMPLATE = "template_dbkcwpl"
const EMAIL_KEY = "1kUZnj4b88VZl_Gfk"

const DAY = 86_400_000

const isoDate = (date: Date) =>
	`${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`

const addDays = (iso: string, days: number) => {
	const parsed = parseIsoDate(iso)
	if (!parsed) return ""
	return new Date(Date.UTC(parsed.year, parsed.month - 1, parsed.day) + days * DAY).toISOString().slice(0, 10)
}

const prettyDate = (iso: string) => {
	const parsed = parseIsoDate(iso)
	if (!parsed) return null
	return new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" }).format(
		Date.UTC(parsed.year, parsed.month - 1, parsed.day)
	)
}

type Values = {
	name: string
	email: string
	phone: string
	room: string
	checkIn: string
	checkOut: string
	adults: number
	children: number
	notes: string
}

const EMPTY: Values = { name: "", email: "", phone: "", room: "", checkIn: "", checkOut: "", adults: 2, children: 0, notes: "" }

type Status = "idle" | "sending" | "sent" | "failed"

const Stepper = ({
	label, name, value, min, max, onChange,
}: { label: string; name: string; value: number; min: number; max: number; onChange: (value: number) => void }) => {
	const id = useId()
	const clamp = (next: number) => Math.max(min, Math.min(max, Number.isFinite(next) ? next : min))
	return (
		<div className="field">
			<label htmlFor={id} className="field-label eyebrow">{label}</label>
			<div className="flex min-h-[3.25rem] items-center gap-3 border-b border-line">
				<button type="button" className="stepper-btn" aria-label={`Fewer ${label.toLowerCase()}`} disabled={value <= min} onClick={() => onChange(clamp(value - 1))}>
					−
				</button>
				<input
					id={id}
					name={name}
					type="number"
					inputMode="numeric"
					required
					min={min}
					max={max}
					value={value}
					onChange={event => onChange(clamp(event.target.valueAsNumber))}
					className="stepper-input field-input tabular !min-h-0 w-12 !border-0 !py-0 text-center"
				/>
				<button type="button" className="stepper-btn" aria-label={`More ${label.toLowerCase()}`} disabled={value >= max} onClick={() => onChange(clamp(value + 1))}>
					+
				</button>
			</div>
		</div>
	)
}

type Props = {
	rooms: Room[]
	/** A room chosen elsewhere on the page; applied to the form when it changes. */
	chosen: { name: string; at: number } | null
}

const Reserve = ({ rooms, chosen }: Props) => {
	const [values, setValues] = useState<Values>(EMPTY)
	const [status, setStatus] = useState<Status>("idle")
	const [earliest, setEarliest] = useState("")
	const set = <K extends keyof Values>(key: K, value: Values[K]) => setValues(current => ({ ...current, [key]: value }))

	useEffect(() => setEarliest(isoDate(new Date(Date.now() + DAY))), [])

	useEffect(() => {
		if (!chosen) return
		setValues(current => ({ ...current, room: chosen.name }))
		setStatus(current => (current === "sent" ? "idle" : current))
	}, [chosen])

	const room = rooms.find(candidate => candidate.name === values.room) ?? null

	const stay = useMemo(() => {
		const arrive = parseIsoDate(values.checkIn)
		const depart = parseIsoDate(values.checkOut)
		const nights =
			arrive && depart
				? Math.round((Date.UTC(depart.year, depart.month - 1, depart.day) - Date.UTC(arrive.year, arrive.month - 1, arrive.day)) / DAY)
				: 0
		const evening = arrive ? eveningOf(arrive) : null
		return {
			nights: nights > 0 ? nights : 0,
			blueHour: evening ? `${plazaClock(evening.blueStart)} – ${plazaClock(evening.blueEnd)}` : null,
		}
	}, [values.checkIn, values.checkOut])

	const estimate = room?.price && stay.nights ? room.price * stay.nights : null
	const party = `${values.adults} adult${values.adults === 1 ? "" : "s"}${values.children ? `, ${values.children} child${values.children === 1 ? "" : "ren"}` : ""}`

	const submit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		if (status === "sending") return
		const form = event.currentTarget
		setStatus("sending")
		try {
			const emailjs = (await import("@emailjs/browser")).default
			await emailjs.sendForm(EMAIL_SERVICE, EMAIL_TEMPLATE, form, EMAIL_KEY)
			setStatus("sent")
		} catch (error) {
			console.error(error)
			setStatus("failed")
		}
	}

	const folio: [string, string | null][] = [
		["Guest", values.name.trim() || null],
		["Room", values.room || null],
		["Arrive", prettyDate(values.checkIn)],
		["Depart", prettyDate(values.checkOut)],
		["Nights", stay.nights ? stay.nights.toString() : null],
		["Party", party],
	]

	return (
		<section id="book" data-theme="limestone" className="relative px-gutter pb-28 pt-20 md:pb-40 md:pt-28">
			<header className="grid items-end gap-x-[6vw] gap-y-8 lg:grid-cols-12">
				<div className="lg:col-span-7">
					<Eyebrow>Reservations</Eyebrow>
					<h2 className="display mt-8 text-[clamp(3rem,8vw,9rem)]" data-reveal="lines">
						Request <em className="text-accent">a stay.</em>
					</h2>
				</div>
				<p className="max-w-[40ch] text-lg leading-relaxed text-muted lg:col-span-5 lg:pb-4" data-reveal="fade">
					Tell us when you would like to come and who you are bringing. A person, not a system, will write back within the day to confirm.
				</p>
			</header>

			<div className="mt-16 grid gap-x-[6vw] gap-y-16 md:mt-24 lg:grid-cols-12">
				<form onSubmit={submit} className="grid grid-cols-2 content-start gap-x-8 gap-y-9 lg:col-span-7" aria-describedby="reserve-status">
					<label className="field col-span-2 sm:col-span-1">
						<span className="field-label eyebrow">Your name</span>
						<input className="field-input" name="hotel-name" type="text" required autoComplete="name" placeholder="Alex Sydney" value={values.name} onChange={event => set("name", event.target.value)} />
					</label>
					<label className="field col-span-2 sm:col-span-1">
						<span className="field-label eyebrow">Room</span>
						<select className="field-input" name="hotel-room" required value={values.room} onChange={event => set("room", event.target.value)}>
							<option value="" disabled>Choose a room</option>
							{rooms.map(option => (
								<option key={option.id} value={option.name}>
									{option.name} — {option.priceLabel}
								</option>
							))}
						</select>
					</label>
					<label className="field col-span-2 sm:col-span-1">
						<span className="field-label eyebrow">Email</span>
						<input className="field-input" name="hotel-email" type="email" required autoComplete="email" placeholder="alex@example.com" value={values.email} onChange={event => set("email", event.target.value)} />
					</label>
					<label className="field col-span-2 sm:col-span-1">
						<span className="field-label eyebrow">Telephone</span>
						<input className="field-input" name="hotel-tel" type="tel" required autoComplete="tel" placeholder="+1 202 555 0190" value={values.phone} onChange={event => set("phone", event.target.value)} />
					</label>
					<label className="field col-span-1">
						<span className="field-label eyebrow">Arriving</span>
						<input
							className="field-input tabular" name="hotel-check-in" type="date" required min={earliest} value={values.checkIn}
							onChange={event => {
								const checkIn = event.target.value
								setValues(current => ({ ...current, checkIn, checkOut: current.checkOut && current.checkOut > checkIn ? current.checkOut : "" }))
							}}
						/>
					</label>
					<label className="field col-span-1">
						<span className="field-label eyebrow">Departing</span>
						<input
							className="field-input tabular" name="hotel-check-out" type="date" required
							min={values.checkIn ? addDays(values.checkIn, 1) : earliest} value={values.checkOut}
							onChange={event => set("checkOut", event.target.value)}
						/>
					</label>
					<div className="col-span-1">
						<Stepper label="Adults" name="hotel-adult" value={values.adults} min={1} max={12} onChange={value => set("adults", value)} />
					</div>
					<div className="col-span-1">
						<Stepper label="Children" name="hotel-children" value={values.children} min={0} max={12} onChange={value => set("children", value)} />
					</div>
					<label className="field col-span-2">
						<span className="field-label eyebrow">Anything we should know?</span>
						<textarea className="field-input" name="hotel-anything" rows={3} placeholder="An anniversary, an early flight, a dislike of coriander…" value={values.notes} onChange={event => set("notes", event.target.value)} />
					</label>

					<div className="col-span-2 mt-2 flex flex-wrap items-center gap-x-8 gap-y-5">
						<button className="btn !min-h-[3.75rem] !px-9" disabled={status === "sending"}>
							{status === "sending" ? "Sending your request…" : status === "sent" ? "Send another request" : "Send request"} <Arrow />
						</button>
						<p id="reserve-status" role="status" className="max-w-[36ch] text-sm leading-snug text-muted">
							{status === "sent" && <span className="text-fg">Thank you. Your request is with the front desk, and a reply is on its way to your inbox.</span>}
							{status === "failed" && (
								<span className="text-[#b3261e]">
									That did not go through. Please try once more, or write to <a className="underline" href={`mailto:${SITE.email}`}>{SITE.email}</a>.
								</span>
							)}
							{(status === "idle" || status === "sending") && "Nothing is charged now. We hold the room for a day while you decide."}
						</p>
					</div>
				</form>

				<aside className="lg:col-span-5" aria-label="Your stay so far">
					<div data-theme="ink" className="cut-lg sticky top-[12vh] px-7 py-8 sm:px-9 sm:py-10">
						<div className="flex items-center justify-between">
							<p className="eyebrow flex items-center gap-3">
								<Gem className="h-4 w-5 text-accent" /> Folio
							</p>
							<p className="eyebrow text-muted">{status === "sent" ? "Requested" : "Draft"}</p>
						</div>

						<dl className="mt-8">
							{folio.map(([term, detail]) => (
								<div key={term} className="flex items-baseline justify-between gap-6 border-t border-line py-3.5">
									<dt className="eyebrow text-muted">{term}</dt>
									<dd className={`display truncate text-right text-xl ${detail ? "" : "italic text-muted opacity-60"}`}>{detail ?? "—"}</dd>
								</div>
							))}
						</dl>

						<div className="relative border-t border-line pt-6">
							<p className="eyebrow text-muted">Estimate</p>
							<p className="display tabular mt-3 text-[clamp(2.75rem,4.6vw,4.25rem)] leading-none">
								{estimate ? formatDollars(estimate) : <span className="italic opacity-40">$ —</span>}
							</p>
							<p className="mt-3 text-sm text-muted">
								{estimate && room?.price
									? `${stay.nights} night${stay.nights === 1 ? "" : "s"} at ${formatDollars(room.price)}. Taxes and service are settled at the desk.`
									: "Choose a room and your dates, and we will do the sum."}
							</p>
							{status === "sent" && (
								<p className="stamp eyebrow absolute right-0 top-5 border border-accent px-4 py-2.5 text-accent" aria-hidden>
									Request received
								</p>
							)}
						</div>

						<p className="eyebrow mt-8 flex items-start gap-3 border-t border-line pt-5 leading-relaxed text-accent">
							<span className="pulse mt-1 shrink-0" />
							<span>
								{stay.blueHour
									? <>Blue hour on your first evening <span className="tabular whitespace-nowrap">{stay.blueHour}</span></>
									: "Pick an arrival date to see your first blue hour"}
							</span>
						</p>
					</div>
				</aside>
			</div>
		</section>
	)
}

export default Reserve
