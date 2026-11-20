import { CmsRoom, CmsImage, sanityImage } from "./sanity"
import { localRoomPhoto, MIN_CMS_WIDTH } from "./room-photos"

export type Room = {
	id: string
	name: string
	/** Nightly rate in dollars, or null when the CMS value isn't numeric. */
	price: number | null
	priceLabel: string
	image: CmsImage | null
	size: number | null
	sleeps: number | null
	outlook: string | null
	blurb: string
}

/**
 * Names, rates and photographs live in the CMS. The finer points of each
 * room are kept here, matched by name, so a room added in the studio still
 * renders gracefully with sensible defaults.
 */
const DETAILS: Record<string, { size: number; sleeps: number; outlook: string; blurb: string }> = {
	"the sapphire suite": {
		size: 148, sleeps: 4, outlook: "Lagoon & ocean",
		blurb: "The whole west corner. A wraparound terrace, a plunge pool, and the best seat in the house when the sky turns.",
	},
	"the executive suite": {
		size: 96, sleeps: 3, outlook: "Lagoon",
		blurb: "A sitting room for the day's work, and a deep stone bath for forgetting it.",
	},
	"the royal club room": {
		size: 72, sleeps: 2, outlook: "Pool court",
		blurb: "Dark timber, a proper writing desk, and a private stair down to the Gem Bar.",
	},
	"luxe room": {
		size: 64, sleeps: 2, outlook: "Garden",
		blurb: "Corner light from two sides and a daybed built for the long part of the afternoon.",
	},
	"family luxe": {
		size: 88, sleeps: 5, outlook: "Garden & pool",
		blurb: "Two bedrooms, one long terrace, and a door between them that closes.",
	},
	"studio bedroom": {
		size: 52, sleeps: 2, outlook: "Garden",
		blurb: "One generous room – bed, sofa, pantry. Made for the guests who extend their stay.",
	},
	"master bedroom": {
		size: 46, sleeps: 2, outlook: "Lagoon",
		blurb: "A king bed under a high timber roof. Most nights the ceiling fan is all you'll need.",
	},
	"king room": {
		size: 44, sleeps: 2, outlook: "Pool court",
		blurb: "Wide bed, wide window, and shutters that fold all the way back.",
	},
	"queen bedroom": {
		size: 38, sleeps: 2, outlook: "Garden",
		blurb: "The quiet side of the house. The birds will wake you a little before the sun does.",
	},
	"premium room": {
		size: 36, sleeps: 2, outlook: "Garden",
		blurb: "Everything the larger rooms have, edited down to the essentials.",
	},
	"couple simple room": {
		size: 30, sleeps: 2, outlook: "Courtyard",
		blurb: "A bed, a terrace, and two chairs facing west. Nothing else is required.",
	},
	"kids bedroom": {
		size: 22, sleeps: 2, outlook: "Courtyard",
		blurb: "Bunks, a reading nook, and a connecting door to wherever you are sleeping.",
	},
}

const FALLBACK_BLURB = "A quiet room in the house, a short barefoot walk from the water."

const dollars = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })

export const formatDollars = (amount: number) => dollars.format(amount)

export const toRoom = (cms: CmsRoom): Room => {
	const numeric = /(\d[\d,]*(?:\.\d+)?)/.exec(cms.rate ?? "")
	const price = numeric ? parseFloat(numeric[1].replace(/,/g, "")) : null
	const details = DETAILS[(cms.name ?? "").trim().toLowerCase()]
	// Prefer the studio's photograph once it is large enough to look sharp;
	// until then use the bundled one (see room-photos.ts).
	const cmsImage = sanityImage(cms.ref)
	const image = cmsImage && cmsImage.width >= MIN_CMS_WIDTH ? cmsImage : localRoomPhoto(cms.name ?? "") ?? cmsImage
	return {
		id: cms._id,
		name: (cms.name ?? "Untitled room").trim(),
		price,
		priceLabel: price !== null ? formatDollars(price) : cms.rate ?? "",
		image,
		size: details?.size ?? null,
		sleeps: details?.sleeps ?? null,
		outlook: details?.outlook ?? null,
		blurb: details?.blurb ?? FALLBACK_BLURB,
	}
}

/** Flagship first: the index reads from the top of the house down. */
export const sortRooms = (rooms: Room[]) =>
	[...rooms].sort((a, b) => (b.price ?? -1) - (a.price ?? -1) || a.name.localeCompare(b.name))

const WORDS = ["No", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen"]

export const numberWord = (n: number) => WORDS[n] ?? n.toString()
