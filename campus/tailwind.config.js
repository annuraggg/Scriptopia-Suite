/** @type {import('tailwindcss').Config} */

import tca from "tailwindcss-animate";
import { heroui } from "@heroui/theme";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/components/*.js",
  ],
  prefix: "",
  theme: {
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

      keyframes: {
        paintSpread: {
          "0%": {
            backgroundColor: "#FFFFFF",
            clipPath: "circle(0% at center)",
          },
          "100%": {
            backgroundColor: "#00A86B60",
            clipPath: "circle(150% at center)",
          },
        },
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
        paintSpread: "paintSpread 3s ease-out forwards",
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          100: "#FEFADD",
          200: "#FEF5BC",
          300: "#FDED9A",
          400: "#FBE580",
          500: "#F9D957",
          600: "#D6B53F",
          700: "#B3922B",
          800: "#90721B",
          900: "#775A10",
          DEFAULT: "hsl(var(--primary))",
        },
        secondary: {
          100: "#CFF3FB",
          200: "#A0E2F8",
          300: "#6EC5EB",
          400: "#48A3D7",
          500: "#1677BD",
          600: "#105CA2",
          700: "#0B4588",
          800: "#07316D",
          900: "#04225A",
          DEFAULT: "hsl(var(--secondary))",
        },
        destructive: {
          100: "#FBCFCD",
          200: "#F89CA1",
          300: "#EC687D",
          400: "#DA4268",
          500: "#C20E4D",
          600: "#A60A50",
          700: "#8B074F",
          800: "#70044A",
          900: "#5D0246",
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          100: "#F0F4F8",
          200: "#E2E9F2",
          300: "#C3CCD8",
          400: "#9CA4B2",
          500: "#6B7280",
          600: "#4E576E",
          700: "#35405C",
          800: "#222B4A",
          900: "#141C3D",
          DEFAULT: "hsl(var(--muted))",
        },
        accent: {
          100: "#DEF7ED",
          200: "#C0F0E0",
          300: "#93D2C3",
          400: "#67A49B",
          500: "#356966",
          600: "#26585A",
          700: "#1A454B",
          800: "#10333C",
          900: "#0A2632",
          DEFAULT: "hsl(var(--accent))",
        },
        popover: {
          100: "#FFFFFF",
          200: "#FFFFFF",
          300: "#FFFFFF",
          400: "#FFFFFF",
          500: "#FFFFFF",
          600: "#FFFFFF",
          700: "#FFFFFF",
          800: "#FFFFFF",
          900: "#FFFFFF",
          DEFAULT: "hsl(var(--popover))",
        },
        card: {
          100: "#FEFEFE",
          200: "#FEFEFE",
          300: "#FCFCFC",
          400: "#F9F9F9",
          500: "#F5F5F5",
          600: "#E8E8E8",
          700: "#DADADA",
          800: "#CDCDCD",
          900: "#C2C2C2",
          DEFAULT: "hsl(var(--card))",
        },
      },
    },
  },
  plugins: [tca, heroui()],
};
