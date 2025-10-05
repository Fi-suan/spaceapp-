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
        midnight: "#0a0e27",
        "midnight-deep": "#060a1f",
        navy: {
          900: "#0a0e27",
          800: "#1a1f3a",
          700: "#242b47",
          600: "#2d3454",
          500: "#363d5f",
        },
        accent: {
          blue: "#3b82f6",
          green: "#10b981",
          purple: "#8b5cf6",
          amber: "#f59e0b",
          orange: "#f97316",
          red: "#ef4444",
          cyan: "#06b6d4",
          yellow: "#eab308",
        },
        text: {
          primary: "#ffffff",
          secondary: "#d1d5db",
          muted: "#9ca3af",
          subtle: "#6b7280",
        },
        border: {
          subtle: "rgba(255, 255, 255, 0.05)",
          muted: "rgba(255, 255, 255, 0.1)",
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
