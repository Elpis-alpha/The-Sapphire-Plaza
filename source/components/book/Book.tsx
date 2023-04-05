import { useRef, useEffect, useState, FormEvent } from "react";
import { toast } from "react-toastify";
import emailjs from '@emailjs/browser';

const Book = ({ roomType, rooms, setRoomType }: { roomType: string, rooms: any[], setRoomType: Function }) => {
	const dateTomorrow = () => {
		let currentDateTime = new Date();
		let year = currentDateTime.getFullYear();
		let month = (currentDateTime.getMonth() + 1);
		let date = (currentDateTime.getDate() + 1);
		let md = []

		if (date < 10) md.push('0' + date);
		else md.push(date);

		if (month < 10) md.push('0' + month);
		else md.push(month);

		return year + "-" + md[1] + "-" + md[0];
	}
	const [minCheckOut, setMinCheckOut] = useState(dateTomorrow())
	const [sendingMail, setSendingMail] = useState(false)
	const formRef = useRef(null)
	useEffect(() => {
		if (roomType.length > 1) {
			// @ts-ignore
			formRef.current?.reset?.()
			// @ts-ignore
			if (formRef.current?.["hotel-room"]) formRef.current["hotel-room"].value = roomType
			setRoomType("")
		}
	}, [roomType, setRoomType])

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (sendingMail) return toast.error("Please be patient")
		setSendingMail(true)
		toast.info("Sending mail")
		const form = event.target as HTMLFormElement
		emailjs.sendForm('service_vnmbxe9', 'template_dbkcwpl', form, '1kUZnj4b88VZl_Gfk')
			.then((result: any) => {
				setSendingMail(false)
				toast.success("Email sent, Our team will respond to your request. Kindly check your mail shortly.")
				form.reset()
			}, (error) => {
				setSendingMail(false)
				toast.error("Email failed to send")
				console.log(error.text);
			}).catch(err => {
				toast.error("Email failed to send")
				setSendingMail(false)
			}).finally(() => {
				setSendingMail(false)
			});
	};

	return (
		<section id="book" className="px-6 md:px-12 xl:px-20 w-full pt-32 flex flex-col gap-10 items-center justify-between">
			<div className="flex-1 flex flex-col items-center justify-between w-full">
				<div className="flex flex-col gap-4 w-full">
					<h3 className="font-playfair font-medium text-2xl flex items-center gap-4">
						Book Now
						<div>
							<svg height="15" className="top-[2px]" viewBox="0 0 135 25" fill="none" xmlns="http://www.w3.org/2000/svg">
								<line y1="11.5176" x2="111" y2="11.5176" stroke="#2B2644" />
								<path d="M123 0.0175781L135 12.0176L123 24.0176L111 12.0176L123 0.0175781Z" fill="#2B2644" />
							</svg>
						</div>
					</h3>
					<h2 className="font-playfair font-medium text-5xl">{"Make a Reservation!"}</h2>
					<p className="pt-4">Make a reservation today and indulge in the finest in luxury hospitality at The Sapphire Plaza. Our team of experts is dedicated to ensuring that every detail of your stay at The Sapphire Plaza is perfect, from start to finish.</p>
				</div>
			</div>
			<form onSubmit={handleSubmit} className="w-full flex flex-wrap gap-6 font-playfair" ref={formRef}>
				<div className="w-full sm:w-[calc(50%_-_12px)]">
					<label className="block font-semibold mb-2" htmlFor="hotel-name">Name</label>
					<input
						className="shadow-sm appearance-none border-none bg-white bg-opacity-30 rounded w-full py-4 px-4 outline-inputOutline"
						required
						id="hotel-name" name="hotel-name" autoComplete="name"
						type="string"
						placeholder="E.g. Alex Sydney"
					/>
				</div>
				<div className="w-full sm:w-[calc(50%_-_12px)]">
					<label className="block font-semibold mb-2" htmlFor="hotel-room">Room</label>
					<input
						className="shadow-sm appearance-none border-none bg-white bg-opacity-30 rounded w-full py-4 px-4 outline-inputOutline"
						required
						id="hotel-room" name="hotel-room"
						type="string"
						placeholder="E.g. Master Bedroom"
						list="hotel-rooms-list"
					/>
					<datalist id="hotel-rooms-list">{rooms.map((room: any) => <option key={"hrl-" + room._id} value={room.name} />)}</datalist>
				</div>
				<div className="w-full sm:w-[calc(50%_-_12px)]">
					<label className="block font-semibold mb-2" htmlFor="hotel-email">Email</label>
					<input
						className="shadow-sm appearance-none border-none bg-white bg-opacity-30 rounded w-full py-4 px-4 outline-inputOutline"
						required
						id="hotel-email" name="hotel-email" autoComplete="email"
						type="email"
						placeholder="E.g. alex@example.com"
					/>
				</div>
				<div className="w-full sm:w-[calc(50%_-_12px)]">
					<label className="block font-semibold mb-2" htmlFor="hotel-tel">Phone</label>
					<input
						className="shadow-sm appearance-none border-none bg-white bg-opacity-30 rounded w-full py-4 px-4 outline-inputOutline"
						required
						id="hotel-tel" name="hotel-tel" autoComplete="tel"
						type="tel"
						placeholder="E.g. +1-202-555-0190"
					/>
				</div>
				<div className="w-full sm:w-[calc(50%_-_12px)]">
					<label className="block font-semibold mb-2" htmlFor="hotel-adult">Adult</label>
					<input
						className="shadow-sm appearance-none border-none bg-white bg-opacity-30 rounded w-full py-4 px-4 outline-inputOutline"
						required
						id="hotel-adult" name="hotel-adult" autoComplete="adult"
						type="number"
						placeholder="E.g. 2"
						min={1}
					/>
				</div>
				<div className="w-full sm:w-[calc(50%_-_12px)]">
					<label className="block font-semibold mb-2" htmlFor="hotel-children">Children</label>
					<input
						className="shadow-sm appearance-none border-none bg-white bg-opacity-30 rounded w-full py-4 px-4 outline-inputOutline"
						required
						id="hotel-children" name="hotel-children" autoComplete="children"
						type="number"
						placeholder="E.g. 3"
						min={0}
					/>
				</div>
				<div className="w-full sm:w-[calc(50%_-_12px)]">
					<label className="block font-semibold mb-2" htmlFor="hotel-tel">Check In</label>
					<input
						className="shadow-sm appearance-none border-none bg-white bg-opacity-30 rounded w-full py-4 px-4 outline-inputOutline"
						required
						id="hotel-check-in" name="hotel-check-in"
						type="date"
						min={dateTomorrow()}
						onChange={e => setMinCheckOut(e.target.value)}
					/>
				</div>
				<div className="w-full sm:w-[calc(50%_-_12px)]">
					<label className="block font-semibold mb-2" htmlFor="hotel-tel">Check Out</label>
					<input
						className="shadow-sm appearance-none border-none bg-white bg-opacity-30 rounded w-full py-4 px-4 outline-inputOutline"
						required
						id="hotel-check-out" name="hotel-check-out"
						type="date"
						min={minCheckOut}
					/>
				</div>
				<div className="w-full">
					<label className="block font-semibold mb-2" htmlFor="hotel-anything">Anything Else?</label>
					<textarea
						className="shadow-sm appearance-none border-none bg-white bg-opacity-30 rounded w-full py-4 px-4 outline-inputOutline h-48"
						required
						id="hotel-anything" name="hotel-anything"
					/>
				</div>
				<div className="w-full">
					<button disabled={sendingMail} className="flex items-center px-4 py-4 rounded-md bg-otherBg text-lightText w-full justify-center text-center hover:bg-darkText">
						{sendingMail ? "Requesting Reservation..." : "Request Reservation"}
					</button>
				</div>
			</form>
		</section>
	)
}
export default Book
