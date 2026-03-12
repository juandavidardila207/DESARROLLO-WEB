import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        orange: {
          DEFAULT: "#F05A00",
          light: "#FF7A2F",
          dark: "#C44700",
          50: "#fff8f5",
          100: "#ffe8d4",
          500: "#F05A00",
          600: "#C44700",
        },
        purple: {
          brand: "#7B3FBF",
        },
        brand: {
          dark: "#1a1a1a",
          gray: "#F4F4F4",
        },
      },
      fontFamily: {
        barlow: ["var(--font-barlow)", "sans-serif"],
        "barlow-condensed": ["var(--font-barlow-condensed)", "sans-serif"],
      },
      animation: {
        "pulse-slow": "pulse 2.5s ease-in-out infinite",
        "bounce-slow": "bounce 1.8s ease-in-out infinite",
        "fade-up": "fadeUp 0.4s ease forwards",
        "slide-in-right": "slideInRight 0.3s ease forwards",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(100%)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
