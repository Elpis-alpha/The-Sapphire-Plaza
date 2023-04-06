import { useState } from "react"
import About from '@/source/components/about/About';
import Navbar from '@/source/components/general/Navbar';
import Hero from '@/source/components/hero/Hero';
import Rooms from '@/source/components/rooms/Rooms';
import { createClient } from 'next-sanity';
import Head from 'next/head'
import Book from "@/source/components/book/Book";
import FAQ from "@/source/components/faq/FAQ";
import Footer from "@/source/components/general/Footer";
import imageUrlBuilder from "@sanity/image-url";

export default function Home({ rooms, faqs }: any) {
  const [roomType, setRoomType] = useState("")
  return (
    <>
      <Head>
        <title>The Sapphire Plaza</title>
        <meta name="description" content="Welcome to The Sapphire Plaza, an exquisite hotel nestled in the heart of the city. Our luxurious accommodations, unparalleled service, and state-of-the-art amenities make us the perfect choice for discerning travelers. Whether you're here for business or pleasure, our elegant rooms and suites, gourmet dining options, and premium facilities are sure to exceed your expectations. Discover the ultimate in comfort, style, and sophistication at The Sapphire Plaza." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#E3DDFF"></meta>
        <meta property="og:title" content="The Sapphire Plaza" />
        <meta property="og:url" content="https://sapphire-plaza.elpis.cc/" />
        <meta property="og:description" content="Welcome to The Sapphire Plaza, an exquisite hotel nestled in the heart of the city. Our luxurious accommodations, unparalleled service, and state-of-the-art amenities make us the perfect choice for discerning travelers. Whether you're here for business or pleasure, our elegant rooms and suites, gourmet dining options, and premium facilities are sure to exceed your expectations. Discover the ultimate in comfort, style, and sophistication at The Sapphire Plaza." />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:image" content={`https://sapphire-plaza.elpis.cc/images/og-image.jpg`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@elpis_alpha" />
        <meta name="twitter:creator" content="@elpis_alpha" />
        <meta name="twitter:title" content="The Sapphire Plaza" />
        <meta name="twitter:description" content="Welcome to The Sapphire Plaza, an exquisite hotel nestled in the heart of the city. Our luxurious accommodations, unparalleled service, and state-of-the-art amenities make us the perfect choice for discerning travelers. Whether you're here for business or pleasure, our elegant rooms and suites, gourmet dining options, and premium facilities are sure to exceed your expectations. Discover the ultimate in comfort, style, and sophistication at The Sapphire Plaza." />
        <meta name="twitter:image" content="https://sapphire-plaza.elpis.cc/images/og-image.jpg" />
      </Head>
      <main className='font-body bg-mainBg text-darkText text-base md:text-xl z-20 min-h-screen flex flex-col font-normal max-w-[1800px] mx-auto overflow-hidden'>
        <Navbar />
        <Hero />
        <About />
        <Rooms rooms={rooms} setRoomType={setRoomType} />
        <Book rooms={rooms} roomType={roomType} setRoomType={setRoomType} />
        <FAQ faqs={faqs} />
        <Footer />
      </main>
    </>
  )
}

const client = createClient({
  projectId: "uqdx1j1r",
  dataset: "production",
  apiVersion: "2023-04-04",
  useCdn: false
});

const builder = imageUrlBuilder(client);

function urlFor(source: any) {
  return builder.image(source);
}

export async function getStaticProps() {
  const rooms = await client.fetch(`*[_type == "room"]`);
  const faqs = await client.fetch(`*[_type == "faq"]`);
  return {
    props: {
      rooms: rooms.map((it: any) => {
        const image = urlFor(it.image).url()
        return { ...it, image }
      }),
      faqs
    }
  };
}
