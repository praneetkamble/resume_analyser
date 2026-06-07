/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: "#030712",
        darkCard: "rgba(17, 24, 39, 0.7)",
        neonGreen: {
          DEFAULT: "#00ff99",
          glow: "rgba(0, 255, 153, 0.4)",
          hover: "#00e68a"
        },
        slateCustom: {
          800: "#1e293b",
          900: "#0f172a"
        }
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        poppins: ["Poppins", "sans-serif"]
      },
      boxShadow: {
        neon: "0 0 15px rgba(0, 255, 153, 0.25)",
        neonGlow: "0 0 25px rgba(0, 255, 153, 0.45)",
      },
      backdropBlur: {
        xs: "2px"
      }
    },
  },
  plugins: [],
}
