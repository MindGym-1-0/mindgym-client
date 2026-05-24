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
        background: "#FAFAF9",
        ink: {
          DEFAULT: "#1C1917",
          60: "#78716C",
          30: "#D6D3D1",
        },
        border: "#E7E5E4",
      },
      fontFamily: {
        sans: ['"DM Sans"', "sans-serif"],
        serif: ['"DM Serif Display"', "serif"],
        display: ['"DM Sans"', "sans-serif"],
      },
      fontSize: {
        h1: ["2rem", { lineHeight: "1.2", fontWeight: "400" }],
        h2: ["1.5rem", { lineHeight: "1.3", fontWeight: "400" }],
        h3: ["1.25rem", { lineHeight: "1.4", fontWeight: "600" }],
        h4: ["1.125rem", { lineHeight: "1.4", fontWeight: "600" }],
        b2: ["0.9375rem", { lineHeight: "1.5" }],
        b3: ["0.8125rem", { lineHeight: "1.5" }],
      },
      spacing: {
        sm: "0.5rem",
        md: "1rem",
        base: "1rem",
        lg: "1.5rem",
      },
    },
  },
  plugins: [],
};
