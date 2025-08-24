/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: [
    "./App.tsx",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#7c3aed", // main violet
          foreground: "#ffffff", // text/icons on primary
        },
        secondary: {
          DEFAULT: "#ede9fe", // light violet background
          foreground: "#7c3aed", // text/icons on secondary
        },
        destructive: {
          DEFAULT: "#ef4444", // red for delete/error
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "#f3f4f6", // gray-100
          foreground: "#6b7280", // gray-500 text
        },
        accent: {
          DEFAULT: "#22c55e", // green for success
          foreground: "#ffffff",
        },
        popover: {
          DEFAULT: "#ffffff",
          foreground: "#1f2937", // gray-800
        },
        card: {
          DEFAULT: "#ffffff",
          foreground: "#1f2937",
        },
      },
      borderRadius: {
        lg: "0.75rem",
        xl: "1rem",
        "2xl": "1.5rem",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
