/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FAF8F5",
        dark: "#0D0D0D",
        gold: "#C9A96E",
        blush: "#E8C4B8",
        "text-primary": "#1A1A1A",
        "text-secondary": "#7A7369",
        border: "#E8E0D6",
        success: "#5D8A6A",
        error: "#C0514B",
      },
      fontFamily: {
        display: ["var(--font-playfair)", "serif"],
        body: ["var(--font-dmsans)", "sans-serif"],
        accent: ["var(--font-cormorant)", "serif"],
      },
    },
  },
  plugins: [],
}
