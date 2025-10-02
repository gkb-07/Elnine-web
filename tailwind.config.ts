import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        heading: ['Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "1.25rem",
          lg: "2rem",
          xl: "2.5rem",
        },
      },
      colors: {
        brand: {
          // Light palette
          50: "#efbbff",
          100: "#d896ff",
          200: "#be29ec",
          300: "#800080",
          400: "#660066",
          // Dark palette (as semantic aliases used via CSS vars)
          d1: "#212531",
          d2: "#322f42",
          d3: "#4b3a70",
          d4: "#b7a2c9",
          d5: "#c5c3c4",
        },
      },
      boxShadow: {
        soft: "0 1px 2px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)",
      },
      borderRadius: {
        xl: "1rem",
      },
    },
  },
  plugins: [],
} satisfies Config;
