/** @type {import('tailwindcss').Config} */

import tca from "tailwindcss-animate";
import { heroui } from "@heroui/react";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
        xs: "360px",
      },
    },
    fontFamily: {
      neue: ["neue-montreal", "sans-serif"],
      gloock: ["Gloock", "sans-serif"],
      poly: ["Polysans", "sans-serif"],
      caveat: ["Caveat", "cursive"],
    },
    extend: {
      boxShadow: {
        "glow-primary": "0 0 15px rgba(var(--primary), 0.5)",
      },
      dropShadow: {
        glow: [
          "0 0px 10px rgba(255,255, 255, 0.35)",
          "0 0px 65px rgba(255, 255,255, 0.2)",
        ],
        "glow-opacity": [
          "0 0px 10px rgba(255,255, 255, 0.03)",
          "0 0px 65px rgba(255, 255,255, 0.03)",
        ],
        "glow-light": [
          "0 0px 1px rgba(255,255, 255, 0.35)",
          "0 0px 10px rgba(255, 255,255, 0.2)",
        ],
        "glow-extralight": [
          "0 0px 1px rgba(255,255, 255, 0.1)",
          "0 0px 5px rgba(255, 255,255, 0.1)",
        ],
        "glow-red": [
          "0 0px 30px rgba(255,0, 0, 0.75)",
          "0 0px 65px rgba(255, 0,0, 0.2)",
        ],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        default: {
          100: "hsl(var(--input))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        shake: {
          "10%, 90%": { transform: "translate3d(-1px, 0, 0)" },
          "20%, 80%": { transform: "translate3d(2px, 0, 0)" },
          "30%, 50%, 70%": { transform: "translate3d(-4px, 0, 0)" },
          "40%, 60%": { transform: "translate3d(4px, 0, 0)" },
        },
        marquee: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(-100%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        shake: "shake 0.82s cubic-bezier(.36,.07,.19,.97) both",
        marquee: "marquee 15s linear infinite",
      },
    },
  },
  plugins: [tca, heroui()],
};
