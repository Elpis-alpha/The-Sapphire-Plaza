import { useState } from "react"
import About from '@/source/components/about/About';
import Navbar from '@/source/components/general/Navbar';
import Hero from '@/source/components/hero/Hero';
import Rooms from '@/source/components/rooms/Rooms';
import { createClient } from 'next-sanity';
import Head from 'next/head'

export default function Home() {
  const [roomType, setRoomType] = useState("")
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
        <Rooms setRoomType={setRoomType} />
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
