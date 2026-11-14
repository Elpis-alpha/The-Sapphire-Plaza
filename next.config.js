/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // GSAP ships its plugins as ES modules; let Next compile them for SSR.
  transpilePackages: ["gsap"],
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 828, 1080, 1280, 1600, 1920, 2560],
  },
}

module.exports = nextConfig
