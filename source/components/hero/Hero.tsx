import Link from "next/link"
import ElpisImage from "../general/ElpisImage"
import { FaArrowRight } from "react-icons/fa"
import { scrollHandler } from "@/source/controllers/SpecialCtrl"

const Hero = () => {
	return (
		<div className="w-full">
			<div className="px-6 md:px-12 xl:px-20 z-20 text-center absolute top-0 left-0 right-0 bottom-0 w-full h-full text-lightText flex">
				<div className="flex flex-col gap-16 w-[80%] m-auto max-w-[950px]">
					<h2 className="font-playfair text-3xl">GET LUXURY AND COMFORT</h2>
					<h1 className="font-playfair text-6xl">Welcome To The Place Where Luxury Meets Affordability</h1>
					<Link href="/#about" onClick={scrollHandler}>
						<span>Explore Now</span>
						<span><FaArrowRight /></span>
					</Link>
				</div>
			</div>
			<div className="z-10 absolute top-0 left-0 right-0 bottom-0 w-full h-full opacity-50 bg-black"></div>
			<ElpisImage src="/images/blur/hero.jpg" title="Hero" className="z-0 w-full min-h-[80vh] max-h-[90vh] object-cover object-center" alt="Hero" />
		</div>
	)
}
export default Hero