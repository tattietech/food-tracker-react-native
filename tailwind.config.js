/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#161622",
        secondary: "#1E7DA9",
        textDark: "#FFFFFF",
        textLight: "#000",
        bgLight: "#EEEEEE",
        bgDark: "#0F1B29",
        fieldDark: "#2E4763",
        fieldLight: "#FFFFFF",
        black: {
          DEFAULT: "#000",
          100: "#1E1E2D",
          200: "#232533",
        },
        gray: {
          100: "#CDCDE0",
        },
        green: "#429854",
        red: "#DC5353",
        amber: "#c29932",
        blue: "#007BFF",
        yellow: "#FFB700"
      }
    },
  },
  plugins: [],
}

