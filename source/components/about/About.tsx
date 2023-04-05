import { scrollHandler } from "@/source/controllers/SpecialCtrl"
import Link from "next/link"
import { FaArrowRight } from "react-icons/fa"
import ElpisImage from "../general/ElpisImage"

const About = () => {
	return (
		<section id="about" className="px-6 md:px-12 xl:px-20 w-full pt-32 flex flex-col xl:flex-row gap-8 xl:gap-20 items-center justify-between">
			<div className="flex-1 flex flex-col gap-4 xl:max-w-[600px] items-start">
				<h3 className="font-playfair font-medium text-2xl flex items-center gap-4">
					ABOUT US
					<div>
						<svg height="15" className="top-[2px]" viewBox="0 0 135 25" fill="none" xmlns="http://www.w3.org/2000/svg">
							<line y1="11.5176" x2="111" y2="11.5176" stroke="#2B2644" />
							<path d="M123 0.0175781L135 12.0176L123 24.0176L111 12.0176L123 0.0175781Z" fill="#2B2644" />
						</svg>
					</div>
				</h3>
				<h2 className="font-playfair font-medium text-5xl">{"At The Sapphire's Plaza"}</h2>
				<p className="leading-normal opacity-80">
					At The Sapphire Plaza, we believe that every guest deserves the very best.
					Our commitment to excellence is reflected in every aspect of our hotel,
					from our beautifully appointed rooms and suites to our world-class dining
					options and state-of-the-art facilities. Come and discover the finest in
					luxury hospitality at The Sapphire Plaza.
				</p>
				<Link href="/#rooms" onClick={scrollHandler} className="px-5 py-3 sm:px-6 sm:py-4 bg-otherBg text-lightText flex items-center gap-2 btn-hov mt-7">
					<span>Our Rooms</span>
					<span className="btn-arr-right"><FaArrowRight /></span>
				</Link>
			</div>
			<div className="xl:w-1/2 xl:max-w-none max-w-md w-full">
				<ElpisImage src="/images/t-side.png" alt="Folding Gallery" className="w-full" title="Folding Gallery" />
			</div>
		</section>
	)
}
export default About