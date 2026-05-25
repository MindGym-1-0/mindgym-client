/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand Colors
        teal: {
          10: "#DDF2EE",
          50: "#DDF2EE",
          100: "#DDF2EE",
          300: "#9ED9D0",
          600: "#126658",
          700: "#0D4038",
          900: "#0D2B26",
        },
        // Semantic Colors
        success: "#36A269",
        "success-bg": "#E7F6ED",
        error: "#D9534F",
        "error-bg": "#FDECEC",
        info: "#4A6FA5",
        "info-bg": "#EDF3FC",
        warning: "#C97A15",
        "warning-bg": "#FFF3DD",
        // Neutral / Ink
        ink: "#171412",
        "ink-60": "#6B6460",
        "ink-30": "#B0AAA6",
        border: "#E9E9E7",
        // Sand
        sand: {
          50: "#FBF5EB",
          100: "#FEF3E2",
          200: "#FEF7C4",
          border: "#E7C98E",
        },
        // Base colors
        surface: "#FFFFFF",
        background: "#F7F7F5",
      },
      fontFamily: {
        serif: ["DM Serif Display", "serif"],
        display: ["DM Serif Display", "serif"],
        sans: ["DM Sans", "sans-serif"],
        caption: ["Inter", "sans-serif"],
      },
      fontSize: {
        h1: ["28px", { lineHeight: "36px", fontWeight: "400" }],
        h2: ["24px", { lineHeight: "32px", fontWeight: "400" }],
        h3: ["20px", { lineHeight: "28px", fontWeight: "400" }],
        h4: ["16px", { lineHeight: "24px", fontWeight: "400" }],
        b1: ["16px", { lineHeight: "20px", fontWeight: "300" }],
        b2: ["14px", { lineHeight: "18px", fontWeight: "400" }],
        b3: ["13px", { lineHeight: "17px", fontWeight: "400" }],
        b4: ["12px", { lineHeight: "16px", fontWeight: "400" }],
        l1: ["12px", { lineHeight: "16px", fontWeight: "600" }],
        l2: ["11px", { lineHeight: "14px", fontWeight: "500" }],
        l3: ["10px", { lineHeight: "14px", fontWeight: "700" }],
      },
      spacing: {
        xs: "8px",
        sm: "12px",
        base: "16px",
        md: "24px",
        lg: "32px",
        xl: "48px",
      },
    },
  },
  plugins: [],
};