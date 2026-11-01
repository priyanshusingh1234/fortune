/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        hackclub: {
          red: "#ec3750",
          darkred: "#b82438",
          dark: "#121217",
          darker: "#0a0a0d",
          card: "#181820",
          cardHover: "#20202c",
          border: "#282836",
          blue: "#338eda",
          green: "#33d6a6",
          orange: "#ff8c37",
          purple: "#8067c3",
          muted: "#8492a6",
          smoke: "#e0e6ed",
        },
        fortune: {
          gold: "#f59e0b",
          amber: "#fbbf24",
          lightGold: "#fef3c7",
          emerald: "#10b981",
          lightEmerald: "#d1fae5",
        }
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      boxShadow: {
        "hackclub": "0 10px 30px -10px rgba(236, 55, 80, 0.3)",
        "gold": "0 10px 30px -10px rgba(245, 158, 11, 0.35)",
        "brutal": "4px 4px 0px 0px #000000",
        "brutal-lg": "6px 6px 0px 0px #000000",
        "brutal-red": "5px 5px 0px 0px #ec3750",
        "brutal-gold": "5px 5px 0px 0px #f59e0b",
      },
      animation: {
        "float": "float 4s ease-in-out infinite",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        glow: {
          "from": { filter: "drop-shadow(0 0 10px rgba(245, 158, 11, 0.4))" },
          "to": { filter: "drop-shadow(0 0 25px rgba(245, 158, 11, 0.8))" },
        }
      }
    },
  },
  plugins: [],
};

