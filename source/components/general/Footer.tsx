import { scrollHandler } from '@/source/controllers/SpecialCtrl'
import { facebook, instagram, mail, twitter } from '@/source/__env'
import Link from 'next/link'
import { FaTwitter, FaInstagram, FaFacebook } from 'react-icons/fa'

const Footer = () => {
	return (
		<footer className="bg-otherBg text-lightText px-6 md:px-12 xl:px-20 w-full mt-32 pt-16 pb-4 flex justify-between flex-wrap flex-col md:flex-row">
			<div className="flex flex-col text-center md:text-left font-playfair gap-6">
				<h1 className="italic text-3xl font-medium flex items-center self-center">The Sapphire Plaza</h1>
				<div className="flex flex-col items-center md:items-start">
					<ul className="flex flex-row items-center">
						<li className="p-3"><a href={facebook} target="_blank" rel="noopener noreferrer"><FaFacebook className="text-2xl" /></a></li>
						<li className="p-3"><a href={twitter} target="_blank" rel="noopener noreferrer"><FaTwitter className="text-2xl" /></a></li>
						<li className='p-3'><a href={instagram} target="_blank" rel="noopener noreferrer"><FaInstagram className="text-2xl" /></a></li>
					</ul>
				</div>
				<p className='italic'>{mail.replace("mailto:", "")}</p>
			</div>
			<div className='flex gap-10 smm:gap-24 justify-center md:justify-start pt-20 md:pt-0'>
				<div className="flex flex-col text-center md:text-left">
					<h3 className='pb-6 uppercase text-2xl'>Our Links</h3>
					<ul className="flex flex-col gap-3">
						<li className=""><Link onClick={scrollHandler} href="/#home">Home</Link></li>
						<li className=""><Link onClick={scrollHandler} href="/#about">About Us</Link></li>
						<li className=""><Link onClick={scrollHandler} href="/#rooms">Our Rooms</Link></li>
					</ul>
				</div>
				<div className="flex flex-col text-center md:text-left">
					<h3 className='pb-6 uppercase text-2xl'>Others</h3>
					<ul className="flex flex-col gap-3">
						<li className=""><Link onClick={scrollHandler} href="/#book">Booking</Link></li>
						<li className=""><Link onClick={scrollHandler} href="/#faq">FAQ</Link></li>
					</ul>
				</div>
			</div>
			<div className="flex flex-col gap-[8px] text-center w-full pt-12">
				<span>The Sapphire Plaza</span>
				<span className="uppercase">© {new Date().getFullYear()} The Sapphire Plaza. All rights reserved.</span>
			</div>
		</footer>
	)
}
export default Footer