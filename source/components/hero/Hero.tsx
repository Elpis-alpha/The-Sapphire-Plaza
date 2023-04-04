import Link from "next/link"
import ElpisImage from "../general/ElpisImage"
import { FaArrowRight } from "react-icons/fa"
import { scrollHandler } from "@/source/controllers/SpecialCtrl"

const Hero = () => {
	return (
		<section id="home" className="w-full">
			<div className="px-6 md:px-12 xl:px-20 z-20 sm:text-center absolute top-0 left-0 right-0 bottom-0 w-full h-full text-lightText flex">
				<div className="flex flex-col md:gap-16 sm:gap-10 gap-8 w-full lg:w-[90%] xl:w-[80%] m-auto max-w-[950px]">
					<h2 className="font-playfair text-base ssm:text-lg smm:text-xl sm:text-2xl lg:text-3xl">GET LUXURY AND COMFORT</h2>
					<h1 className="font-playfair text-xl ssm:text-2xl smm:text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-snug md:leading-snug lg:leading-snug">Welcome To The Place Where Luxury Meets Affordability</h1>
					<Link href="/#about" onClick={scrollHandler} className="px-5 py-3 sm:px-6 sm:py-4 border border-lightText flex self-start sm:self-center items-center gap-2 btn-hov">
						<span>Explore Now</span>
						<span className="btn-arr-right"><FaArrowRight /></span>
					</Link>
				</div>
			</div>
			<div className="z-10 absolute top-0 left-0 right-0 bottom-0 w-full h-full opacity-50 bg-black"></div>
			<ElpisImage src="/images/blur/hero.jpg" title="Hero" className="z-0 w-full min-h-[70vh] max-h-[90vh] object-cover object-center" alt="Hero" />
		</section>
	)
}
export default Hero