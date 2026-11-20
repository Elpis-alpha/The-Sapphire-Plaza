/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // GSAP ships its plugins as ES modules; let Next compile them for SSR.
  transpilePackages: ["gsap"],
  images: {
    formats: ["image/avif", "image/webp"],
    // Every `quality` used in the source must be listed here: on Cloudflare the
    // image handler rejects (HTTP 400) any q that is not in this list, and its
    // default is [75] only. Next 14 ignores the key; the Worker reads it from
    // the build's images-manifest.json. Keep in sync with quality={...} props
    // and with the q= in source/lib/room-photos.ts.
    qualities: [75, 85, 90],
    // 3840 lets phones and retina laptops fetch the hero at its full 2880px
    // (Next never enlarges past the source), instead of topping out at 2560.
    deviceSizes: [640, 828, 1080, 1280, 1600, 1920, 2560, 3840],
  },
}

module.exports = nextConfig
