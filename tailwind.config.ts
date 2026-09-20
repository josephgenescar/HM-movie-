import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        hm: {
          bg: "#0A0A0C",        // noir profond
          surface: "#151517",   // gris très sombre
          surface2: "#1F1F22",
          border: "#2A2A2E",
          text: "#F5F5F7",
          muted: "#9A9AA2",
          accent: "#8E1B2E",      // bordeaux — identité HM(Movie), distinct du rouge Netflix
          "accent-hover": "#A6293D",
          gold: "#D9B26A"        // touche premium
        }
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"]
      },
      backgroundImage: {
        "hero-gradient":
          "linear-gradient(180deg, rgba(10,10,12,0) 0%, rgba(10,10,12,0.6) 60%, rgba(10,10,12,1) 100%)"
      }
    }
  },
  plugins: []
};

export default config;
