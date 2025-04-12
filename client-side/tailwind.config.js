/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        fira: ["'Fira Sans'", "sans-serif"], 
      },
      colors: {
        white: '#ffffff',
        'transparent-black': '#1E1E1E', // Darker shade for better contrast
        primary: '#F97C3E',            // Warm accent color
        secondary: '#FFE2D2',          // Soft background color
        'transparent-white': '#FFF8F5', // Light background shade
        'text-main': '#2A2A2A',        // Main text color
        'text-light': '#5C5C5C',       // Secondary text color
        'border-color': '#E0E0E0',     // Border color
        'card-bg': '#FFFDFD',          // Card background color
        'accent-light': '#FFB07C',     // Light accent color
        'accent-dark': '#D65F29',      // Dark accent color
        'highlight': '#FFEB3B',        // Highlight color
        'error': '#F44336',            // Error color
        'success': '#4CAF50',          // Success color
        'info': '#2196F3',             // Info color
        'warning': '#FF9800',          // Warning color
      },
    },
  },
  plugins: [],
}
