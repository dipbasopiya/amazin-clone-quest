import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: { center: true, padding: "2rem", screens: { "2xl": "1400px" } },
    extend: {
      fontFamily: { 
        sans: ["'Plus Jakarta Sans'", "'SF Pro Display'", "system-ui", "-apple-system", "sans-serif"],
        display: ["'Instrument Sans'", "'Plus Jakarta Sans'", "system-ui", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        surface: {
          "0": "hsl(var(--surface-0))",
          "1": "hsl(var(--surface-1))",
          "2": "hsl(var(--surface-2))",
        },
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
        destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },
        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
        popover: { DEFAULT: "hsl(var(--popover))", foreground: "hsl(var(--popover-foreground))" },
        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
        peach: { DEFAULT: "hsl(var(--peach))", foreground: "hsl(var(--peach-foreground))" },
        lavender: { DEFAULT: "hsl(var(--lavender))", foreground: "hsl(var(--lavender-foreground))" },
        "soft-blue": { DEFAULT: "hsl(var(--soft-blue))", foreground: "hsl(var(--soft-blue-foreground))" },
        "soft-yellow": { DEFAULT: "hsl(var(--soft-yellow))", foreground: "hsl(var(--soft-yellow-foreground))" },
        "soft-pink": { DEFAULT: "hsl(var(--soft-pink))", foreground: "hsl(var(--soft-pink-foreground))" },
        "soft-green": { DEFAULT: "hsl(var(--soft-green))", foreground: "hsl(var(--soft-green-foreground))" },
        "soft-cyan": { DEFAULT: "hsl(var(--soft-cyan))", foreground: "hsl(var(--soft-cyan-foreground))" },
        orange: "hsl(var(--orange))",
        aqua: "hsl(var(--aqua))",
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: { 
        lg: "var(--radius)", 
        md: "calc(var(--radius) - 2px)", 
        sm: "calc(var(--radius) - 4px)", 
        xl: "calc(var(--radius) + 4px)", 
        "2xl": "calc(var(--radius) + 8px)",
        "3xl": "calc(var(--radius) + 12px)" 
      },
      boxShadow: { 
        soft: "var(--shadow-soft)", 
        hover: "var(--shadow-hover)",
        elevated: "var(--shadow-elevated)",
        glow: "var(--shadow-glow)",
        inset: "var(--shadow-inset)"
      },
      keyframes: {
        "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
        "accordion-up": { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" }
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
      },
      animation: { 
        "accordion-down": "accordion-down 0.2s ease-out", 
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "scale-in": "scale-in 0.3s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "slide-up": "slide-up 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards",
      },
      transitionDuration: {
        "400": "400ms",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
