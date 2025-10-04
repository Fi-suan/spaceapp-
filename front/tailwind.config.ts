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
        midnight: "#0B1220",
        "midnight-deep": "#050B1A",
        navy: {
          900: "#0B1220",
          800: "#101C33",
          700: "#152741",
          600: "#19253B",
          500: "#1A2538",
        },
        accent: {
          blue: "#4F8CFF",
          green: "#22C55E",
          purple: "#8F7BFF",
          amber: "#FACC15",
          orange: "#F97316",
          red: "#F87171",
        },
        text: {
          primary: "#FFFFFF",
          secondary: "#D0D6E5",
          muted: "#A8B3C9",
          subtle: "#7B88A8",
        },
        border: {
          subtle: "rgba(255, 255, 255, 0.05)",
          muted: "rgba(168, 179, 201, 0.15)",
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
