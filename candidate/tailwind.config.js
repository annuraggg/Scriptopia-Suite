/** @type {import('tailwindcss').Config} */

import tca from "tailwindcss-animate";

import { nextui } from "@nextui-org/react";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
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

        "glow-dark": ["0 0px 10px rgba(1,1,1, 1)", "0 0px 65px rgba(1,1,1, 1)"],
        "glow-opacity-dark": [
          "0 0px 10px rgba(0,0, 0, 0.03)",
          "0 0px 65px rgba(0,0,0, 0.03)",
        ],
        "glow-light-dark": [
          "0 0px 1px rgba(0,0, 0, 0.35)",
          "0 0px 10px rgba(0,0,0, 0.2)",
        ],
        "glow-extralight-dark": [
          "0 0px 1px rgba(0,0, 0, 0.1)",
          "0 0px 5px rgba(0,0,0, 0.1)",
        ],

        "glow-green": [
          "0 0px 10px rgba(76,175,80, 0.3)",
          "0 0px 65px rgba(76,175,80, 0.3)",
        ],
        "glow-opacity-green": [
          "0 0px 10px rgba(76,175,80, 0.03)",
          "0 0px 65px rgba(76,175,80, 0.03)",
        ],
        "glow-light-green": [
          "0 0px 1px rgba(76,175,80, 0.35)",
          "0 0px 10px rgba(76,175,80, 0.2)",
        ],
        "glow-extralight-green": [
          "0 0px 1px rgba(76,175,80, 0.1)",
          "0 0px 5px rgba(76,175,80, 0.1)",
        ],

        "glow-blue": [
          "0 0px 10px rgba(0,115,230, 0.3)",
          "0 0px 65px rgba(0,115,230, 0.3)",
        ],
        "glow-amber": [
          "0 0px 10px rgba(255,193,7, 0.3)",
          "0 0px 65px rgba(255,193,7, 0.3)",
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
          50: "#e8f5e9",
          100: "#c8e6c9",
          200: "#a5d6a7",
          300: "#81c784",
          400: "#66bb6a",
          500: "#4CAF50", // Primary
          600: "#43a047",
          700: "#388e3c",
          800: "#2e7d32",
          900: "#1b5e20",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          50: "#e3f2fd",
          100: "#bbdefb",
          200: "#90caf9",
          300: "#64b5f6",
          400: "#42a5f5",
          500: "#0073E6", // Secondary
          600: "#0064c8",
          700: "#0055aa",
          800: "#004688",
          900: "#00376a",
        },
        warning: {
          DEFAULT: "#FFC107", // Support
          50: "#fff8e1",
          100: "#ffecb3",
          200: "#ffe082",
          300: "#ffd54f",
          400: "#ffca28",
          500: "#FFC107", // Support
          600: "#ffb300",
          700: "#ffa000",
          800: "#ff8f00",
          900: "#ff6f00",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
          50: "#ffebee",
          100: "#ffcdd2",
          200: "#ef9a9a",
          300: "#e57373",
          400: "#ef5350",
          500: "#e53935", // Custom danger
          600: "#d32f2f",
          700: "#c62828",
          800: "#b71c1c",
          900: "#7f0000",
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        shake: "shake 0.82s cubic-bezier(.36,.07,.19,.97) both",
      },
    },
  },
  plugins: [
    tca,
    nextui({
      addCommonColors: true,
      layout: {
        spacingUnit: 4, // in px
        disableAutoRTL: false,
        breakpoints: {
          xs: "650px",
          sm: "960px",
          md: "1280px",
          lg: "1400px",
          xl: "1920px",
        },
      },
      themes: {
        light: {
          colors: {
            // Base colors
            background: "#FFFFFF", // Background
            foreground: "#1D2935", // Text

            // Primary colors
            primary: {
              50: "#e8f5e9",
              100: "#c8e6c9",
              200: "#a5d6a7",
              300: "#81c784",
              400: "#66bb6a",
              500: "#4CAF50", // Primary
              600: "#43a047",
              700: "#388e3c",
              800: "#2e7d32",
              900: "#1b5e20",
              DEFAULT: "#4CAF50",
              foreground: "#FFFFFF",
            },

            // Secondary colors
            secondary: {
              50: "#e3f2fd",
              100: "#bbdefb",
              200: "#90caf9",
              300: "#64b5f6",
              400: "#42a5f5",
              500: "#0073E6", // Secondary
              600: "#0064c8",
              700: "#0055aa",
              800: "#004688",
              900: "#00376a",
              DEFAULT: "#0073E6",
              foreground: "#FFFFFF",
            },

            // Support/accent colors
            warning: {
              50: "#fff8e1",
              100: "#ffecb3",
              200: "#ffe082",
              300: "#ffd54f",
              400: "#ffca28",
              500: "#FFC107", // Support
              600: "#ffb300",
              700: "#ffa000",
              800: "#ff8f00",
              900: "#ff6f00",
              DEFAULT: "#FFC107",
              foreground: "#1D2935",
            },

            // Feedback colors
            success: {
              50: "#e8f5e9",
              100: "#c8e6c9",
              200: "#a5d6a7",
              300: "#81c784",
              400: "#66bb6a",
              500: "#4CAF50", // Same as primary
              600: "#43a047",
              700: "#388e3c",
              800: "#2e7d32",
              900: "#1b5e20",
              DEFAULT: "#4CAF50",
              foreground: "#FFFFFF",
            },

            danger: {
              50: "#ffebee",
              100: "#ffcdd2",
              200: "#ef9a9a",
              300: "#e57373",
              400: "#ef5350",
              500: "#e53935", // Custom danger
              600: "#d32f2f",
              700: "#c62828",
              800: "#b71c1c",
              900: "#7f0000",
              DEFAULT: "#e53935",
              foreground: "#FFFFFF",
            },

            // Focus
            focus: "#4CAF50",

            // Default
            default: {
              50: "#f8fafc",
              100: "#f1f5f9",
              200: "#e2e8f0",
              300: "#cbd5e1",
              400: "#94a3b8",
              500: "#64748b",
              600: "#475569",
              700: "#334155",
              800: "#1e293b",
              900: "#0f172a",
              DEFAULT: "#1D2935",
              foreground: "#FFFFFF",
            },

            // Divider and border colors
            divider: "#E0E0E0",
            overlay: "rgba(0,0,0,0.5)",

            // Content colors
            content1: "#FFFFFF",
            content2: "#f5f5f5",
            content3: "#eeeeee",
            content4: "#e0e0e0",
          },
          layout: {
            boxShadow: {
              small:
                "0px 0px 5px rgba(0,0,0,0.05), 0px 2px 10px rgba(0,0,0,0.1)",
              medium:
                "0px 0px 15px rgba(0,0,0,0.08), 0px 5px 20px rgba(0,0,0,0.12)",
              large:
                "0px 0px 30px rgba(0,0,0,0.1), 0px 10px 40px rgba(0,0,0,0.15)",
            },
          },
        },
        dark: {
          colors: {
            // Base colors
            background: "#1D2935", // Text color as dark mode background
            foreground: "#FFFFFF", // Background color as dark mode text

            // Primary colors
            primary: {
              50: "#e8f5e9",
              100: "#c8e6c9",
              200: "#a5d6a7",
              300: "#81c784",
              400: "#66bb6a",
              500: "#4CAF50", // Primary
              600: "#43a047",
              700: "#388e3c",
              800: "#2e7d32",
              900: "#1b5e20",
              DEFAULT: "#4CAF50",
              foreground: "#FFFFFF",
            },

            // Secondary colors
            secondary: {
              50: "#e3f2fd",
              100: "#bbdefb",
              200: "#90caf9",
              300: "#64b5f6",
              400: "#42a5f5",
              500: "#0073E6", // Secondary
              600: "#0064c8",
              700: "#0055aa",
              800: "#004688",
              900: "#00376a",
              DEFAULT: "#0073E6",
              foreground: "#FFFFFF",
            },

            // Support/accent colors
            warning: {
              50: "#fff8e1",
              100: "#ffecb3",
              200: "#ffe082",
              300: "#ffd54f",
              400: "#ffca28",
              500: "#FFC107", // Support
              600: "#ffb300",
              700: "#ffa000",
              800: "#ff8f00",
              900: "#ff6f00",
              DEFAULT: "#FFC107",
              foreground: "#1D2935",
            },

            // Feedback colors
            success: {
              50: "#e8f5e9",
              100: "#c8e6c9",
              200: "#a5d6a7",
              300: "#81c784",
              400: "#66bb6a",
              500: "#4CAF50", // Same as primary
              600: "#43a047",
              700: "#388e3c",
              800: "#2e7d32",
              900: "#1b5e20",
              DEFAULT: "#4CAF50",
              foreground: "#FFFFFF",
            },

            danger: {
              50: "#ffebee",
              100: "#ffcdd2",
              200: "#ef9a9a",
              300: "#e57373",
              400: "#ef5350",
              500: "#e53935", // Custom danger
              600: "#d32f2f",
              700: "#c62828",
              800: "#b71c1c",
              900: "#7f0000",
              DEFAULT: "#e53935",
              foreground: "#FFFFFF",
            },

            // Focus
            focus: "#4CAF50",

            // Default
            default: {
              50: "#f8fafc",
              100: "#f1f5f9",
              200: "#e2e8f0",
              300: "#cbd5e1",
              400: "#94a3b8",
              500: "#64748b",
              600: "#475569",
              700: "#334155",
              800: "#1e293b",
              900: "#0f172a",
              DEFAULT: "#FFFFFF",
              foreground: "#1D2935",
            },

            // Divider and border colors
            divider: "#2A3744",
            overlay: "rgba(0,0,0,0.7)",

            // Content colors
            content1: "#1D2935",
            content2: "#263440",
            content3: "#2F3E4B",
            content4: "#394857",
          },
          layout: {
            boxShadow: {
              small:
                "0px 0px 5px rgba(0,0,0,0.2), 0px 2px 10px rgba(0,0,0,0.3)",
              medium:
                "0px 0px 15px rgba(0,0,0,0.3), 0px 5px 20px rgba(0,0,0,0.4)",
              large:
                "0px 0px 30px rgba(0,0,0,0.4), 0px 10px 40px rgba(0,0,0,0.5)",
            },
          },
        },
      },
    }),
  ],
};
