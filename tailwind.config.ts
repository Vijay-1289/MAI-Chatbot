import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        mai: {
          light: "#f4f1f9",
          DEFAULT: "#6b46c1",
          dark: "#553c9a",
        },
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
      },
      keyframes: {
        "message-fade-in": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "typing": {
          "0%": { width: "0%" },
          "100%": { width: "100%" },
        },
        "gradient-x": {
          "0%, 100%": {
            "background-size": "200% 200%",
            "background-position": "left center",
          },
          "50%": {
            "background-size": "200% 200%",
            "background-position": "right center",
          },
        },
        "aurora": {
          "0%, 100%": {
            transform: "translate(0, 0) scale(1)",
            opacity: "0.5"
          },
          "50%": {
            transform: "translate(-5%, 5%) scale(1.1)",
            opacity: "0.7"
          }
        },
        "aurora-reverse": {
          "0%, 100%": {
            transform: "translate(0, 0) scale(1.1)",
            opacity: "0.6"
          },
          "50%": {
            transform: "translate(5%, -5%) scale(1)",
            opacity: "0.4"
          }
        },
        "aurora-slow": {
          "0%, 100%": {
            transform: "translate(0, 0) scale(1.05)",
            opacity: "0.5"
          },
          "50%": {
            transform: "translate(-3%, 3%) scale(1)",
            opacity: "0.3"
          }
        }
      },
      animation: {
        "message-fade-in": "message-fade-in 0.3s ease-out forwards",
        "typing": "typing 1s ease-out infinite",
        "gradient-x": "gradient-x 15s ease infinite",
        "aurora": "aurora 15s ease infinite",
        "aurora-reverse": "aurora-reverse 20s ease infinite",
        "aurora-slow": "aurora-slow 25s ease infinite"
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
