const { fontFamily } = require("tailwindcss/defaultTheme")

module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        midnight: "#050b1a",
        navy: {
          900: "#0b1424",
          800: "#101c33",
          700: "#152741",
        },
        accent: {
          blue: "#4f8cff",
          green: "#22c55e",
          amber: "#f97316",
          red: "#f87171",
        },
        text: {
          primary: "#f8fbff",
          muted: "#a8b3c9",
          subtle: "#7b88a8",
        },
        border: {
          subtle: "rgba(255, 255, 255, 0.05)",
        },
      },
      fontFamily: {
        sans: ["Inter", ...fontFamily.sans],
      },
      boxShadow: {
        card: "0 18px 45px rgba(5, 14, 30, 0.35)",
      },
      backgroundImage: {
        "radial-fade": "radial-gradient(circle at top, rgba(79, 140, 255, 0.25), transparent 60%)",
        "conic-score": "conic-gradient(from 180deg at 50% 50%, #22c55e 0deg, #22c55e var(--score), rgba(248, 250, 252, 0.08) var(--score))",
      },
    },
  },
  plugins: [],
}
