/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // GSAP ships its plugins as ES modules; let Next compile them for SSR.
  transpilePackages: ["gsap"],
  images: {
    formats: ["image/avif", "image/webp"],
    // 3840 lets phones and retina laptops fetch the hero at its full 2880px
    // (Next never enlarges past the source), instead of topping out at 2560.
    deviceSizes: [640, 828, 1080, 1280, 1600, 1920, 2560, 3840],
  },
}

module.exports = nextConfig
