/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#D4A574",
        secondary: "#A89968",
        success: "#10b981",
        danger: "#ef4444",
        warning: "#f59e0b",
        info: "#3b82f6",
        beige: {
          50: "#F5F1ED",
          100: "#E8DFD7",
          200: "#D4A574",
          300: "#C9B89E",
          400: "#A89968",
          500: "#9D8B6F",
        }
      },
    },
  },
}
