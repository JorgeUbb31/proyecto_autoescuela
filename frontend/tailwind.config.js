/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#C89E73",      // Ochre Gold
        secondary: "#5D4037",    // Espresso
        accent: "#A1887F",
        success: "#22c55e",
        danger: "#ef4444",
        warning: "#f59e0b",
        info: "#3b82f6",
        // Surface palette
        surface: "#fbf9f4",       // Bone white
        "surface-light": "#ffffff",
        "surface-variant": "#e4e2dd",
        "surface-dim": "#f2ede7",
        // Text colors
        "on-surface": "#1a1a1a",
        "on-primary": "#ffffff",
        beige: {
          50: "#fbf9f4",
          100: "#f0ebe5",
          200: "#e4ddd4",
          300: "#d4a574",
          400: "#c89e73",
          500: "#a1887f",
          600: "#8b7660",
          700: "#5d4037",
        }
      },
      fontFamily: {
        display: ['"Manrope"', 'sans-serif'],
        headline: ['"Manrope"', 'sans-serif'],
        body: ['"Hanken Grotesk"', 'sans-serif'],
      },
      boxShadow: {
        warm: '0 4px 20px rgba(93, 64, 55, 0.08)',
        'warm-lg': '0 12px 32px rgba(93, 64, 55, 0.12)',
      },
      spacing: {
        'gutter': '16px',
        'margin-xs': '8px',
        'margin-md': '24px',
        'margin-lg': '40px',
      }
    },
  },
}
