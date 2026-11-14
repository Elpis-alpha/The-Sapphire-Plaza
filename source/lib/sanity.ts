/**
 * Content comes from Sanity (https://sapphire-plaza.sanity.studio/).
 * The public dataset is read over plain HTTPS – no client library needed.
 */

const PROJECT_ID = "uqdx1j1r"
const DATASET = "production"
const API_VERSION = "2023-04-04"

export type CmsRoom = { _id: string; name: string; rate: string; ref: string | null }
export type Faq = { _id: string; question: string; answer: string }

const QUERY = `{
	"rooms": *[_type == "room"]{ _id, name, rate, "ref": image.asset._ref },
	"faqs": *[_type == "faq"] | order(_createdAt asc){ _id, question, answer }
}`

export const fetchContent = async (): Promise<{ rooms: CmsRoom[]; faqs: Faq[] }> => {
	const url = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/query/${DATASET}?query=${encodeURIComponent(QUERY)}`
	const response = await fetch(url)
	if (!response.ok) throw new Error(`Sanity responded ${response.status}`)
	const { result } = await response.json()
	return { rooms: result?.rooms ?? [], faqs: result?.faqs ?? [] }
}

export type CmsImage = { src: string; srcSet: string; width: number; height: number }

/** Turn an asset reference (`image-<id>-<w>x<h>-<format>`) into CDN URLs. */
export const sanityImage = (ref: string | null): CmsImage | null => {
	const match = ref && /^image-([a-zA-Z0-9]+)-(\d+)x(\d+)-(\w+)$/.exec(ref)
	if (!match) return null
	const [, id, w, h, format] = match
	const width = +w
	const height = +h
	const base = `https://cdn.sanity.io/images/${PROJECT_ID}/${DATASET}/${id}-${w}x${h}.${format}`
	const at = (size: number) => `${base}?w=${Math.min(size, width)}&fit=max&auto=format&q=82`
	const widths = Array.from(new Set([400, 640, 960, 1280].map(size => Math.min(size, width))))
	return {
		src: at(960),
		srcSet: widths.map(size => `${at(size)} ${size}w`).join(", "),
		width,
		height,
	}
}
