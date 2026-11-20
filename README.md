# The Sapphire Plaza

**Stay for the blue hour.** A concept site for a lagoon-side hotel on the south coast of Sri Lanka, built around the few minutes each evening when the sky turns the colour of the stone the island is known for.

Live at [sapphire-plaza.elpis.cc](https://sapphire-plaza.elpis.cc/). This is a portfolio piece, not a real hotel.

## What is in it

- **A hero you can touch.** The pool in the photograph is live: a small WebGL shader refracts the image inside a hand-traced outline of the water, and the pointer leaves ripples. Falls back to the plain photograph without WebGL or with reduced motion.
- **Tonight's real blue hour.** The site works out, from the hotel's coordinates, when the sun sits between 4° and 6° below the horizon, and counts down to it. Pick an arrival date in the reservation form and it tells you when your first one begins.
- **The Hours.** A pinned, sideways chapter that walks through one evening while the sky behind it moves from gold afternoon to night.
- **A room index.** Rooms come from the CMS and read as a typographic list with one framed photograph that follows the room you are considering.
- **A reservation folio.** The form fills in a live summary of the stay, with nights and an estimate, and sends the request by email.

## Stack

- [Next.js](https://nextjs.org/) (pages router, static generation with revalidation) and TypeScript
- [Tailwind CSS](https://tailwindcss.com/)
- [GSAP](https://gsap.com/) with ScrollTrigger and SplitText, and [Lenis](https://lenis.darkroom.engineering/) for scrolling
- [Sanity](https://www.sanity.io/) for rooms and FAQs, read over its HTTP API
- [EmailJS](https://www.emailjs.com/) for reservation requests

## Content

Rooms (name, nightly rate, photograph) and FAQs are edited in the studio at <https://sapphire-plaza.sanity.studio/>. The page picks up changes within ten minutes. Room sizes and descriptions live in `source/lib/rooms.ts`, matched by room name; a room without an entry there still renders with defaults.

## Running it

```bash
npm install
```

```bash
npm run dev
```

## Deploying to Cloudflare

The site runs as a Cloudflare Worker (named `sapphire-plaza`) through [OpenNext for Cloudflare](https://opennext.js.org/cloudflare), pinned to a release that supports Next 14. Setup is done in the Cloudflare dashboard; nothing needs running locally.

1. **Create the cache bucket.** Dashboard → R2 → Create bucket, named exactly `sapphire-plaza-cache`. It holds the regenerated pages (the page revalidates every 10 minutes, so Sanity edits appear without a redeploy).
2. **Connect the repository.** Workers & Pages → Create → Import a repository → this repo. Use the project/Worker name `sapphire-plaza` (it must match `name` in `wrangler.jsonc`) and set:

   | Setting | Value |
   | --- | --- |
   | Production branch | `main` |
   | Build command | `npx opennextjs-cloudflare build` |
   | Deploy command | `npx opennextjs-cloudflare deploy` |
   | Root directory | `/` |

   No build variables are needed: Sanity is read from its public API and the EmailJS settings are in the source.
3. **Point the domain.** Worker → Settings → Domains & routes → Add → Custom domain → `sapphire-plaza.elpis.cc` (the `elpis.cc` zone must be on this Cloudflare account). Remove any old DNS record for that name first, or the hostname will conflict.

Things that will break the images if changed:

- `wrangler.jsonc` must keep the `images` binding. Without it `/_next/image` serves the original, unoptimised files.
- Every `quality={n}` used in the source, and the `q=` in `source/lib/room-photos.ts`, must be listed in `images.qualities` in `next.config.js`. The Worker answers any other quality with HTTP 400, which shows as a missing image.

Preview the Worker build locally with `npm run preview`.

## Where things are

| Path | What |
| --- | --- |
| `pages/index.tsx` | The page, and the CMS fetch |
| `source/components/` | One file per section |
| `source/components/HeroWater.tsx` | The water shader |
| `source/lib/sun.ts` | Sunrise, sunset and blue-hour maths |
| `source/lib/motion.ts`, `source/lib/reveals.ts` | Scroll and animation plumbing |
| `styles/globals.css` | Theme tokens and component styles |

Photography is from [Unsplash](https://unsplash.com/).

### Room photographs

The room photos in the CMS are only 640px wide, which looks soft at the sizes the site shows them. Each room therefore has a 2400px stand-in in `public/images/rooms/`, wired up in `source/lib/room-photos.ts`. A room uses its CMS photograph only when that is at least 1280px wide, so uploading a larger one in the studio replaces the stand-in automatically.

| Room | Photographer |
| --- | --- |
| The Sapphire Suite | [Rosemary Media](https://unsplash.com/photos/hanging-chairs-on-seaside-patio-jkO94J7ijBM) |
| The Executive Suite | [Clay Banks](https://unsplash.com/photos/bedroom-with-wooden-bed-and-bathroom-yOs9Zc5JvTw) |
| The Royal Club Room | [Clay Banks](https://unsplash.com/photos/a-bedroom-with-two-beds-and-a-desk-rP0OTFdVaak) |
| Luxe Room | [Rob Wingate](https://unsplash.com/photos/window-curtain-open-wide-Fd9tUmRBJzk) |
| Family Luxe | [Sanju Pandita](https://unsplash.com/photos/a-living-room-filled-with-furniture-and-lots-of-windows-JheggqJ6Lxc) |
| Studio Bedroom | [Aquilion Property](https://unsplash.com/photos/a-room-with-a-bed-and-a-table-with-a-bowl-on-it-dEuvqNbwRuw) |
| Master Bedroom | [sidath vimukthi](https://unsplash.com/photos/bedroom-with-wooden-walls-and-bed-XToGJDquirQ) |
| King Room | [Zane Persaud](https://unsplash.com/photos/white-bed-linen-on-bed-FC3gmwd6Mns) |
| Queen Bedroom | [ANNIE HATUANH](https://unsplash.com/photos/green-trees-viewed-through-window-MO_ShjtcMUs) |
| Premium Room | [Meklay YOTKHAMSAY](https://unsplash.com/photos/a-neatly-made-bed-in-a-modern-hotel-room-mNdhu5gl_P4) |
| Couple Simple Room | [Johnny Ho](https://unsplash.com/photos/two-chairs-and-table-overlook-ocean-view-J24R8RLPj1A) |
| Kids Bedroom | [Alex Tyson](https://unsplash.com/photos/a-bedroom-with-bunk-beds-and-a-couch-ooxQsJEKqwU) |
