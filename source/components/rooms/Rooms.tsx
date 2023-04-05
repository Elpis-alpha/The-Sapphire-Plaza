import { scrollHandler } from "@/source/controllers/SpecialCtrl"
import { useState } from "react"
import { FaHotel } from "react-icons/fa"
import { Oval } from "react-loader-spinner"
import { v4 } from "uuid"

const Rooms = ({ setRoomType, rooms }: { setRoomType: Function, rooms: any[] }) => {
	// Fake rooms, use sanity to get real rooms

	const [count, setCount] = useState(6)
	return (
		<section id="rooms" className="px-6 md:px-12 xl:px-20 w-full pt-32 flex flex-col gap-10 items-center justify-between">
			<div className="flex-1 flex flex-col xl:flex-row xl:gap-10 gap-5 items-center justify-between w-full">
				<div className="flex flex-col gap-4 w-full">
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
				</div>
				<p className="xl:max-w-[500px] ">
					Our rooms are elegantly furnished and designed to provide the ultimate in comfort and relaxation. Enjoy stunning views and luxurious amenities in every room.
				</p>
			</div>
			<div className="w-full">
				<div className="flex flex-wrap w-full gap-4">
					{rooms.length === 0 && <div className="py-8 font-playfair uppercase w-full text-2xl">Sorry, there are no free rooms at the moment</div>}
					{rooms.slice(0, count).map((item: any) => <div key={item._id} className="w-full md:w-[calc(50%_-_8px)] xl:w-[calc(33.3333%_-_((2_*_16px)_/_3))] bg-darkOverlay">
						<div className="w-full pt-[70%]">
							{/* {item.name} */}

							{/* Item Name */}
							<div className="absolute bottom-0 left-0 z-20 flex items-center justify-center pl-4 pb-8 font-playfair text-white">
								{item.name}
							</div>

							{/* Item Rate */}
							<div className="absolute top-0 left-0 z-20 flex items-center justify-center bg-white px-6 py-4">
								{item.rate}
							</div>

							{/* Rent Item */}
							<div onClick={() => { setRoomType(item.name); scrollHandler(null, "#book") }}
								className="absolute top-2 right-2 z-20 flex items-center justify-center bg-white px-2 py-2 
								bg-opacity-20 text-3xl cursor-pointer text-white hover:text-linkHover hover:bg-opacity-50" title="Book Now">
								<FaHotel />
							</div>

							{/* Item Image */}
							<div className="absolute top-0 left-0 right-0 bottom-0 w-full h-full z-10 flex items-center justify-center overflow-hidden pic-scale-cont">
								<img src={item.image} alt={item.name} title={item.name} className="w-full h-full object-cover" />
								<div className="z-10 absolute top-0 left-0 right-0 bottom-0 w-full h-full opacity-30 bg-black"></div>
							</div>

							{/* Item Loader */}
							<div className="absolute top-0 left-0 right-0 bottom-0 w-full h-full z-0 flex items-center justify-center">
								<Oval color="#fff" secondaryColor="#a8a8a8" width="5pc" height="5pc" />
							</div>
						</div>
					</div>)}
				</div>

				<div className="flex pt-4 gap-4">
					{(count > 6) && <button className="w-full bg-otherBg p-4 text-white rounded-md hover:bg-darkText" onClick={() => setCount(prev => prev - 3)}>Show Less</button>}
					{count < rooms.length && <button className="w-full bg-otherBg p-4 text-white rounded-md hover:bg-darkText" onClick={() => setCount(prev => prev + 3)}>Show More</button>}
				</div>
			</div>
		</section>
	)
}
export default Rooms