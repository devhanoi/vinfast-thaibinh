import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0A0A0A",
          soft: "#1F1F1F",
          muted: "#4B4B4B",
        },
        brand: {
          DEFAULT: "#00A664",
          dark: "#00854F",
          light: "#E6F7EF",
        },
        paper: {
          DEFAULT: "#FFFFFF",
          soft: "#FAFAFA",
          line: "#EAEAEA",
        },
      },
      fontFamily: {
        sans: ["var(--font-be-vietnam)", "system-ui", "sans-serif"],
        display: ["var(--font-be-vietnam)", "system-ui", "sans-serif"],
      },
      container: {
        center: true,
        padding: { DEFAULT: "1rem", md: "2rem", lg: "3rem" },
        screens: { sm: "640px", md: "768px", lg: "1024px", xl: "1200px" },
      },
      boxShadow: {
        card: "0 1px 2px rgba(10,10,10,0.04), 0 8px 24px rgba(10,10,10,0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
