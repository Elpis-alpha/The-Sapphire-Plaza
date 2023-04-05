import { useState } from "react"
import About from '@/source/components/about/About';
import Navbar from '@/source/components/general/Navbar';
import Hero from '@/source/components/hero/Hero';
import Rooms from '@/source/components/rooms/Rooms';
import { createClient } from 'next-sanity';
import Head from 'next/head'
import Book from "@/source/components/book/Book";
import { v4 } from "uuid";
import FAQ from "@/source/components/faq/FAQ";

export default function Home() {
  const [roomType, setRoomType] = useState("")
  const rooms: any = [
    {
      _id: v4(),
      name: "Master Bedroom",
      rate: "$300/night",
      image: "/rooms/1.jpg"
    },
    {
      _id: v4(),
      name: "Couple Simple Room",
      rate: "$150/night",
      image: "/rooms/2.jpg"
    },
    {
      _id: v4(),
      name: "Luxe Room",
      rate: "$700/night",
      image: "/rooms/3.jpg"
    },
    {
      _id: v4(),
      name: "Kids Bedroom",
      rate: "$100/night",
      image: "/rooms/4.jpg"
    },
    {
      _id: v4(),
      name: "Family Luxe",
      rate: "$500/night",
      image: "/rooms/5.jpg"
    },
    {
      _id: v4(),
      name: "Premium Room",
      rate: "$180/night",
      image: "/rooms/6.jpg"
    },
    {
      _id: v4(),
      name: "King Room",
      rate: "$300/night",
      image: "/rooms/7.jpg"
    },
    {
      _id: v4(),
      name: "Queen Bedroom",
      rate: "$200/night",
      image: "/rooms/8.jpg"
    },
    {
      _id: v4(),
      name: "Studio Bedroom",
      rate: "$450/night",
      image: "/rooms/9.jpg"
    },
    {
      _id: v4(),
      name: "Studio Bedroom",
      rate: "$450/night",
      image: "/rooms/9.jpg"
    },
    {
      _id: v4(),
      name: "Studio Bedroom",
      rate: "$450/night",
      image: "/rooms/9.jpg"
    },
  ]
  const faqs: any = [
    {
      _id: v4(),
      question: "What is the check-in time at The Sapphire Plaza?",
      answer: "The check-in time is 3:00 PM, and check-out time is 12:00 PM. Early check-in and late check-out may be available upon request, subject to availability.",
    },
    {
      _id: v4(),
      question: "What is the check-in time at The Sapphire Plaza?",
      answer: "The check-in time is 3:00 PM, and check-out time is 12:00 PM. Early check-in and late check-out may be available upon request, subject to availability.",
    },
    {
      _id: v4(),
      question: "What is the check-in time at The Sapphire Plaza?",
      answer: "The check-in time is 3:00 PM, and check-out time is 12:00 PM. Early check-in and late check-out may be available upon request, subject to availability.",
    },
  ]
  return (
    <>
      <Head>
        <title>The Sapphire Plaza</title>
        <meta name="description" content="Welcome to The Sapphire Plaza, an exquisite hotel nestled in the heart of the city. Our luxurious accommodations, unparalleled service, and state-of-the-art amenities make us the perfect choice for discerning travelers. Whether you're here for business or pleasure, our elegant rooms and suites, gourmet dining options, and premium facilities are sure to exceed your expectations. Discover the ultimate in comfort, style, and sophistication at The Sapphire Plaza." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#E3DDFF"></meta>
      </Head>
      <main className='font-body bg-mainBg text-darkText text-base md:text-xl z-20 min-h-screen flex flex-col font-normal max-w-[1800px] mx-auto overflow-hidden'>
        <Navbar />
        <Hero />
        <About />
        <Rooms rooms={rooms} setRoomType={setRoomType} />
        <Book rooms={rooms} roomType={roomType} setRoomType={setRoomType} />
        <FAQ faqs={faqs} />
        <div className="py-60"></div>
      </main>
    </>
  )
}

// const client = createClient({
//   projectId: "uqdx1j1r",
//   dataset: "production",
//   apiVersion: "2023-04-04",
//   useCdn: false
// });

// export async function getStaticProps() {
//   const pets = await client.fetch(`*[_type == "pet"]`);
//   return { props: { pets } };
// }
