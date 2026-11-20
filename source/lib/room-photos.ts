import { CmsImage } from "./sanity"

/**
 * Room photographs that ship with the site. The CMS originals are only 640px
 * wide, which is soft anywhere a room photo is shown larger than a thumbnail,
 * so a room uses its CMS photograph only when that is at least
 * `MIN_CMS_WIDTH` wide, and otherwise falls back to these. Upload a larger
 * photograph in the studio and it takes over automatically.
 *
 * Photography is from Unsplash (https://unsplash.com/license); credits are
 * kept here and in the README. Files are 2400px wide, in public/images/rooms.
 */
export const MIN_CMS_WIDTH = 1280

type LocalPhoto = { file: string; width: number; height: number; by: string; page: string }

// Keyed by lower-cased room name, like DETAILS in rooms.ts.
const PHOTOS: Record<string, LocalPhoto> = {
	"the sapphire suite": { file: "the-sapphire-suite.jpg", width: 2400, height: 1600, by: "Rosemary Media", page: "https://unsplash.com/photos/hanging-chairs-on-seaside-patio-jkO94J7ijBM" },
	"the executive suite": { file: "the-executive-suite.jpg", width: 2400, height: 1600, by: "Clay Banks", page: "https://unsplash.com/photos/bedroom-with-wooden-bed-and-bathroom-yOs9Zc5JvTw" },
	"the royal club room": { file: "the-royal-club-room.jpg", width: 2400, height: 1600, by: "Clay Banks", page: "https://unsplash.com/photos/a-bedroom-with-two-beds-and-a-desk-rP0OTFdVaak" },
	"luxe room": { file: "luxe-room.jpg", width: 2400, height: 2001, by: "Rob Wingate", page: "https://unsplash.com/photos/window-curtain-open-wide-Fd9tUmRBJzk" },
	"family luxe": { file: "family-luxe.jpg", width: 2400, height: 1600, by: "Sanju Pandita", page: "https://unsplash.com/photos/a-living-room-filled-with-furniture-and-lots-of-windows-JheggqJ6Lxc" },
	"studio bedroom": { file: "studio-bedroom.jpg", width: 2400, height: 1600, by: "Aquilion Property", page: "https://unsplash.com/photos/a-room-with-a-bed-and-a-table-with-a-bowl-on-it-dEuvqNbwRuw" },
	"master bedroom": { file: "master-bedroom.jpg", width: 2400, height: 1600, by: "sidath vimukthi", page: "https://unsplash.com/photos/bedroom-with-wooden-walls-and-bed-XToGJDquirQ" },
	"king room": { file: "king-room.jpg", width: 2400, height: 1625, by: "Zane Persaud", page: "https://unsplash.com/photos/white-bed-linen-on-bed-FC3gmwd6Mns" },
	"queen bedroom": { file: "queen-bedroom.jpg", width: 2400, height: 1724, by: "ANNIE HATUANH", page: "https://unsplash.com/photos/green-trees-viewed-through-window-MO_ShjtcMUs" },
	"premium room": { file: "premium-room.jpg", width: 2400, height: 1600, by: "Meklay YOTKHAMSAY", page: "https://unsplash.com/photos/a-neatly-made-bed-in-a-modern-hotel-room-mNdhu5gl_P4" },
	"couple simple room": { file: "couple-simple-room.jpg", width: 2400, height: 1600, by: "Johnny Ho", page: "https://unsplash.com/photos/two-chairs-and-table-overlook-ocean-view-J24R8RLPj1A" },
	"kids bedroom": { file: "kids-bedroom.jpg", width: 2400, height: 1601, by: "Alex Tyson", page: "https://unsplash.com/photos/a-bedroom-with-bunk-beds-and-a-couch-ooxQsJEKqwU" },
}

// Widths Next's image optimiser allows; it never enlarges past the 2400px file.
const WIDTHS = [640, 828, 1080, 1280, 1600, 1920, 2560]

export const localRoomPhoto = (name: string): CmsImage | null => {
	const photo = PHOTOS[name.trim().toLowerCase()]
	if (!photo) return null
	const path = `/images/rooms/${photo.file}`
	const at = (width: number) => `/_next/image?url=${encodeURIComponent(path)}&w=${width}&q=85`
	return {
		src: at(1080),
		srcSet: WIDTHS.map(width => `${at(width)} ${width}w`).join(", "),
		width: photo.width,
		height: photo.height,
	}
}
