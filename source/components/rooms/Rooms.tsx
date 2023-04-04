const Rooms = () => {
	return (
		<section id="about" className="px-6 md:px-12 xl:px-20 w-full pt-32 flex flex-col xl:flex-row gap-8 xl:gap-20 items-center justify-between">
			<div className="flex-1 flex flex-col gap-4 xl:max-w-[600px] items-start">
				<h3 className="font-playfair font-medium text-2xl flex items-center gap-4">
					Our Rooms
					<div>
						<svg height="15" className="top-[2px]" viewBox="0 0 135 25" fill="none" xmlns="http://www.w3.org/2000/svg">
							<line y1="11.5176" x2="111" y2="11.5176" stroke="#2B2644" />
							<path d="M123 0.0175781L135 12.0176L123 24.0176L111 12.0176L123 0.0175781Z" fill="#2B2644" />
						</svg>
					</div>
				</h3>
				<h2 className="font-playfair font-medium text-5xl">{"The best room just for you!"}</h2>
				<p className="max-w-[520px]">
					Our rooms are elegantly furnished and designed to provide the ultimate in comfort and relaxation. Enjoy stunning views and luxurious amenities in every room.
				</p>
			</div>
		</section>
	)
}
export default Rooms