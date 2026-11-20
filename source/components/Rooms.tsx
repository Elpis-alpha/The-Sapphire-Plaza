import { useRef, useState } from "react"
import { numberWord, Room } from "../lib/rooms"
import { Arrow, Eyebrow } from "./Marks"

const specs = (room: Room) =>
	[room.size && `${room.size} m²`, room.sleeps && `Sleeps ${room.sleeps}`, room.outlook].filter(Boolean) as string[]

const Photo = ({ room, sizes, className = "" }: { room: Room; sizes: string; className?: string }) =>
	room.image ? (
		<img
			src={room.image.src}
			srcSet={room.image.srcSet}
			sizes={sizes}
			width={room.image.width}
			height={room.image.height}
			alt={`${room.name} at The Sapphire Plaza`}
			loading="lazy"
			decoding="async"
			className={`h-full w-full object-cover ${className}`}
		/>
	) : (
		<div className="grid h-full w-full place-items-center bg-abyss">
			<span className="eyebrow text-bone/50">Photograph to follow</span>
		</div>
	)

/**
 * The room index. On large screens it reads as a typographic list with one
 * framed photograph that follows whichever room you are considering; on
 * small screens the same rooms become a row of cards to swipe through.
 */
const Rooms = ({ rooms, onReserve }: { rooms: Room[]; onReserve: (room: Room) => void }) => {
	const [active, setActive] = useState(0)
	const previous = useRef(0)
	const current = rooms[active]

	const consider = (index: number) => {
		if (index === active) return
		previous.current = active
		setActive(index)
	}

	return (
		<section id="rooms" data-theme="ink" className="relative pb-28 pt-28 md:pb-40 md:pt-44">
			<header className="grid items-end gap-x-[6vw] gap-y-8 px-gutter lg:grid-cols-12">
				<div className="lg:col-span-8">
					<Eyebrow>The Rooms</Eyebrow>
					<h2 className="display mt-8 text-[clamp(3rem,8vw,9rem)]" data-reveal="lines">
						Where the <br className="hidden sm:block" />
						night <em>ends.</em>
					</h2>
				</div>
				<p className="max-w-[40ch] text-lg leading-relaxed text-muted lg:col-span-4 lg:pb-4" data-reveal="fade">
					{rooms.length > 0
						? `${numberWord(rooms.length)} ways to sleep here, from a courtyard room with two chairs facing west to the whole corner of the house. Every one of them opens to the air.`
						: "The house is being readied. Rooms will be listed here shortly."}
				</p>
			</header>

			{rooms.length === 0 && (
				<p className="display mx-gutter mt-20 border-t border-line pt-10 text-3xl italic text-muted">
					There are no rooms free at the moment. Write to us and we will tell you the day one opens.
				</p>
			)}

			{/* Large screens: the index */}
			{current && (
				<div className="mt-24 hidden gap-x-[6vw] px-gutter lg:grid lg:grid-cols-12">
					<ol className="room-list col-span-7">
						{rooms.map((room, index) => (
							<li key={room.id}>
								<button
									type="button"
									className="room-row grid w-full grid-cols-[3.25rem_minmax(0,1fr)_auto] items-baseline gap-x-6 border-t border-line py-7 text-left"
									data-active={index === active}
									onMouseEnter={() => consider(index)}
									onFocus={() => consider(index)}
									onClick={() => onReserve(room)}
									aria-label={`Reserve ${room.name}, ${room.priceLabel} per night`}
								>
									<span className="eyebrow tabular text-muted">{(index + 1).toString().padStart(2, "0")}</span>
									<span>
										<span className="display block text-[clamp(1.9rem,3.3vw,3.5rem)] leading-none">{room.name}</span>
										<span className="eyebrow mt-3 block text-muted">{specs(room).join("  ·  ")}</span>
									</span>
									<span className="text-right">
										<span className="display tabular block text-[clamp(1.5rem,2.1vw,2.1rem)] italic leading-none">{room.priceLabel}</span>
										<span className="eyebrow mt-3 block text-muted">per night</span>
									</span>
								</button>
							</li>
						))}
						<li className="border-t border-line" aria-hidden />
					</ol>

					<aside className="col-span-5">
						<div className="sticky top-[12vh]">
							<div className="cut-lg relative aspect-[4/5] max-h-[62vh] w-full overflow-hidden bg-abyss">
								{rooms.map((room, index) => (
									<div
										key={room.id}
										className="room-shot absolute inset-0"
										data-state={index === active ? "active" : index === previous.current ? "previous" : "idle"}
									>
										{/* 4:5 frame capped at 62vh, landscape photo cropped by height: painted ~93vh wide. */}
										<Photo room={room} sizes="(min-width: 1024px) 95vh, 0px" />
									</div>
								))}
								<p className="eyebrow tabular absolute left-5 top-5 z-10 bg-ink/70 px-3 py-2 text-bone backdrop-blur">
									{(active + 1).toString().padStart(2, "0")} / {rooms.length.toString().padStart(2, "0")}
								</p>
							</div>
							<div className="mt-6 flex items-start justify-between gap-8" aria-live="polite">
								<p key={current.id} className="max-w-[34ch] leading-relaxed text-muted motion-safe:animate-[rise_.7s_var(--ease-glide)_both]">
									{current.blurb}
								</p>
								<button type="button" className="btn shrink-0" onClick={() => onReserve(current)}>
									Reserve <Arrow />
								</button>
							</div>
						</div>
					</aside>
				</div>
			)}

			{/* Small screens: cards to swipe */}
			{rooms.length > 0 && (
				<div className="mt-14 lg:hidden">
					<ol className="snap-row flex gap-4 overflow-x-auto px-gutter pb-2" data-lenis-prevent-touch>
						{rooms.map((room, index) => (
							<li key={room.id} className="w-[78vw] max-w-[22rem] shrink-0 snap-start scroll-ml-[var(--gutter)]">
								<div className="cut-lg relative aspect-[4/5] overflow-hidden bg-abyss">
									{/* Card is 78vw (max 22rem) wide and 4:5, so the cropped photo paints ~1.9x that. */}
									<Photo room={room} sizes="(min-width: 1024px) 0px, (min-width: 452px) 42rem, 147vw" />
									<p className="eyebrow tabular absolute left-4 top-4 bg-ink/70 px-3 py-2 text-bone backdrop-blur">
										{(index + 1).toString().padStart(2, "0")} / {rooms.length.toString().padStart(2, "0")}
									</p>
								</div>
								<div className="mt-5 flex items-baseline justify-between gap-4">
									<h3 className="display text-[1.75rem] leading-none">{room.name}</h3>
									<p className="display tabular shrink-0 text-xl italic">{room.priceLabel}</p>
								</div>
								<p className="eyebrow mt-3 text-muted">{specs(room).join("  ·  ")}</p>
								<p className="mt-4 text-[0.95rem] leading-relaxed text-muted">{room.blurb}</p>
								<button type="button" className="text-link mt-5" onClick={() => onReserve(room)}>
									Reserve this room <Arrow />
								</button>
							</li>
						))}
					</ol>
					<p className="eyebrow mt-8 flex items-center gap-3 px-gutter text-muted">
						Swipe <Arrow />
					</p>
				</div>
			)}
		</section>
	)
}

export default Rooms
