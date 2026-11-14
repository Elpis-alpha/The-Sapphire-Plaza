/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./source/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Fixed palette – sampled from the hero photograph.
        ink: "#05081A",
        abyss: "#0A1236",
        sapphire: { DEFAULT: "#2346E8", deep: "#122A9C", bright: "#6C8BFF", pale: "#B4C2FF" },
        lamp: { DEFAULT: "#F0B46A", soft: "#F8DDB4" },
        limestone: { DEFAULT: "#EFE8DB", dark: "#E0D6C3" },
        bone: "#F3F1EA",
        // Semantic tokens – these follow the active page theme.
        bg: "var(--bg)",
        fg: "var(--fg)",
        muted: "var(--muted)",
        line: "var(--line)",
        accent: "var(--accent)",
        "accent-ink": "var(--accent-ink)",
      },
      fontFamily: {
        display: ["var(--font-display)", "Didot", "Bodoni MT", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "Menlo", "monospace"],
      },
      spacing: { gutter: "var(--gutter)" },
      screens: { xs: "420px", "3xl": "1800px" },
      transitionTimingFunction: {
        cut: "cubic-bezier(0.7, 0, 0.2, 1)",
        glide: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
}
