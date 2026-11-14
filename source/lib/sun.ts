/**
 * Solar position maths for the Plaza.
 *
 * The hotel's whole proposition is the blue hour, so the site computes the
 * real thing rather than hard-coding a time: the window in which the sun
 * sits between 4° and 6° below the horizon at the Plaza's coordinates.
 * Near the equator the sun drops almost vertically, so the window is short.
 */

export const PLAZA = {
	lat: 5.9836,
	lon: 80.3312,
	/** Asia/Colombo is UTC+5:30 all year – no daylight saving. */
	utcOffsetMinutes: 330,
	place: "South Coast, Sri Lanka",
	coords: "5°59′N  80°19′E",
}

const RAD = Math.PI / 180
const DAY_MS = 86_400_000
const J1970 = 2440587.5
const J2000 = 2451545

export type PlazaDate = { year: number; month: number; day: number }

/** The calendar date at the Plaza for a given instant. */
export const plazaDateOf = (instant: Date): PlazaDate => {
	const shifted = new Date(instant.getTime() + PLAZA.utcOffsetMinutes * 60_000)
	return { year: shifted.getUTCFullYear(), month: shifted.getUTCMonth() + 1, day: shifted.getUTCDate() }
}

/** "HH:MM" at the Plaza for a given instant. */
export const plazaClock = (instant: Date): string => {
	const shifted = new Date(instant.getTime() + PLAZA.utcOffsetMinutes * 60_000)
	const h = shifted.getUTCHours().toString().padStart(2, "0")
	const m = shifted.getUTCMinutes().toString().padStart(2, "0")
	return `${h}:${m}`
}

const fromJulian = (j: number) => new Date((j - J1970) * DAY_MS)

/**
 * Instants at which the sun crosses `elevation` degrees on the given Plaza
 * date – once on the way up, once on the way down.
 */
const crossings = ({ year, month, day }: PlazaDate, elevation: number) => {
	const julianNoon = Date.UTC(year, month - 1, day, 12) / DAY_MS + J1970
	const n = Math.round(julianNoon - J2000)
	const meanSolar = n - PLAZA.lon / 360
	const M = (357.5291 + 0.98560028 * meanSolar) % 360
	const C = 1.9148 * Math.sin(M * RAD) + 0.02 * Math.sin(2 * M * RAD) + 0.0003 * Math.sin(3 * M * RAD)
	const lambda = (M + C + 180 + 102.9372) % 360
	const transit = J2000 + meanSolar + 0.0053 * Math.sin(M * RAD) - 0.0069 * Math.sin(2 * lambda * RAD)
	const declination = Math.asin(Math.sin(lambda * RAD) * Math.sin(23.4397 * RAD))
	const cosHour =
		(Math.sin(elevation * RAD) - Math.sin(PLAZA.lat * RAD) * Math.sin(declination)) /
		(Math.cos(PLAZA.lat * RAD) * Math.cos(declination))
	const hourAngle = Math.acos(Math.max(-1, Math.min(1, cosHour))) / RAD
	return { rising: fromJulian(transit - hourAngle / 360), setting: fromJulian(transit + hourAngle / 360) }
}

export type Evening = {
	sunrise: Date
	sunset: Date
	blueStart: Date
	blueEnd: Date
	/** Whole minutes the blue hour lasts. */
	minutes: number
}

export const eveningOf = (date: PlazaDate): Evening => {
	const horizon = crossings(date, -0.833)
	const blueStart = crossings(date, -4).setting
	const blueEnd = crossings(date, -6).setting
	return {
		sunrise: horizon.rising,
		sunset: horizon.setting,
		blueStart,
		blueEnd,
		minutes: Math.round((blueEnd.getTime() - blueStart.getTime()) / 60_000),
	}
}

/** Parse a `YYYY-MM-DD` form value into a Plaza date. */
export const parseIsoDate = (iso: string): PlazaDate | null => {
	const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso)
	if (!match) return null
	return { year: +match[1], month: +match[2], day: +match[3] }
}

export type BlueHourStatus =
	| { phase: "before"; minutesUntil: number; evening: Evening }
	| { phase: "during"; minutesLeft: number; evening: Evening }
	| { phase: "after"; evening: Evening; tomorrow: Evening }

/** Where "now" sits relative to tonight's blue hour. */
export const blueHourStatus = (now: Date): BlueHourStatus => {
	const today = plazaDateOf(now)
	const evening = eveningOf(today)
	if (now < evening.blueStart) {
		return { phase: "before", minutesUntil: Math.ceil((evening.blueStart.getTime() - now.getTime()) / 60_000), evening }
	}
	if (now <= evening.blueEnd) {
		return { phase: "during", minutesLeft: Math.max(1, Math.ceil((evening.blueEnd.getTime() - now.getTime()) / 60_000)), evening }
	}
	const next = plazaDateOf(new Date(now.getTime() + DAY_MS))
	return { phase: "after", evening, tomorrow: eveningOf(next) }
}

export const formatCountdown = (minutes: number): string => {
	const h = Math.floor(minutes / 60)
	const m = minutes % 60
	if (h === 0) return `${m} min`
	return `${h} h ${m.toString().padStart(2, "0")} min`
}
