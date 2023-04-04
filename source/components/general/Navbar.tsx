import { Spin as Hamburger } from "hamburger-react"
import { useState } from "react"
import { FaInstagram, FaFacebook, FaEnvelope } from "react-icons/fa"
import Link from "next/link"
import { facebook, instagram, mail } from "@/source/__env"

const Navbar = () => {
	const [navIsOpen, setNavIsOpen] = useState(false)
	const scrollHandler = (e: any) => {
		e.preventDefault();
		setNavIsOpen(false)
		const hashVal = e.currentTarget.getAttribute('href').split("/").join("")
		// @ts-ignore
		window.history.pushState(null, null, `${hashVal}`)
		document.querySelector(hashVal)?.scrollIntoView({
			behavior: 'smooth'
		});
	}

	return (
		<>
			<nav id="top" className="flex w-full justify-between bg-[#ffffff05] border-b border-[#ffffff4d] xl:gap-0 gap-2 relative backdrop-blur-xl px-6 md:px-12 xl:px-20 py-4 sm:py-5 lg:py-6">
				<div className="flex-1 xl:flex-initial flex">
					<h1 className="italic text-3xl font-playfair font-medium flex items-center">The Sapphire Plaza</h1>
				</div>
				<div className="flex items-center gap-5 xl:gap-8">
					<div className="hidden xl:flex items-center">
						<ul className="flex gap-5 xl:gap-8 items-center">
							<li><Link onClick={scrollHandler} className="hover:text-linkHover duration-75	transition-all" href="/#home">Home</Link></li>
							<li><Link onClick={scrollHandler} className="hover:text-linkHover duration-75	transition-all" href="/#about">About Us</Link></li>
							<li><Link onClick={scrollHandler} className="hover:text-linkHover duration-75	transition-all" href="/#rooms">Our Rooms</Link></li>
							<li><Link onClick={scrollHandler} className="hover:text-linkHover duration-75	transition-all" href="/#jobs">Open Jobs</Link></li>
							<li><Link onClick={scrollHandler} className="hover:text-linkHover duration-75	transition-all" href="/#faq">FAQ</Link></li>
						</ul>
					</div>
					<div className="hidden smm:flex items-center text-brightGreen">
						<Link onClick={scrollHandler} href="/#section-book" className="flex items-center gap-[8px] xl:px-[16px] xl:py-[12px] px-[14px] py-[8px] bg-otherBg text-lightText">
							<span>Book Now</span>
						</Link>
					</div>
				</div>
				<div className="flex xl:hidden items-center">
					<Hamburger toggled={navIsOpen} toggle={setNavIsOpen} distance="sm" rounded />
				</div>
			</nav>
			<div className={`fixed xl:hidden block backdrop-blur-sm w-full h-full top-0 bottom-0 z-50 ${navIsOpen ? "left-0" : "left-[101vw]"} transition-all duration-500`}>
				<div className="el-sm-nav h-full w-[300px] relative mr-0 ml-auto p-[32px] overflow-auto flex flex-col gap-[60px] justify-between bg-mainBg">
					<div className="flex flex-col gap-[50px]">
						<div className="left-[-11px]"><Hamburger toggled={navIsOpen} toggle={setNavIsOpen} distance="sm" rounded /></div>
						<ul className="flex gap-[32px] flex-col items-start text-sm">
							<li><Link onClick={scrollHandler} className="hover:text-linkHover duration-75	transition-all" href="/#home">Home</Link></li>
							<li><Link onClick={scrollHandler} className="hover:text-linkHover duration-75	transition-all" href="/#about">About Us</Link></li>
							<li><Link onClick={scrollHandler} className="hover:text-linkHover duration-75	transition-all" href="/#rooms">Our Rooms</Link></li>
							<li><Link onClick={scrollHandler} className="hover:text-linkHover duration-75	transition-all" href="/#jobs">Open Jobs</Link></li>
							<li><Link onClick={scrollHandler} className="hover:text-linkHover duration-75	transition-all" href="/#faq">FAQ</Link></li>
							<div className="flex smm:hidden items-center text-[#00C914]">
								<Link onClick={scrollHandler} href="/#section-book" className="flex items-center gap-[8px] xl:px-[16px] xl:py-[12px] px-[14px] py-[8px] bg-otherBg text-lightText">
									<span>Book Now</span>
								</Link>
							</div>
						</ul>
					</div>
					<div className="flex flex-col gap-[30px] text-center">
						<div className="flex gap-[16px] justify-center">
							<a href={instagram} target="_blank" className="h-[18px] duration-75 transition-all hover:scale-110 flex" rel="noopener noreferrer"><FaInstagram /></a>
							<a href={facebook} target="_blank" className="h-[18px] duration-75 transition-all hover:scale-110 flex" rel="noopener noreferrer"><FaFacebook /></a>
							<a href={mail} target="_blank" className="h-[18px] duration-75 transition-all hover:scale-110 flex" rel="noopener noreferrer"><FaEnvelope /></a>
						</div>
						<div className="flex flex-col gap-[8px] text-[10px]">
							<span>The Sapphire Plaza</span>
							<span className="text-[#848484] uppercase">© {new Date().getFullYear()} The Sapphire Plaza. All rights reserved.</span>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
export default Navbar