/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#1D4ED8', 
        'secondary': '#3B82F6',
        'dark-primary': '#1E40AF', 
        'dark-secondary': '#2563EB', 
      },
      backgroundColor: {
        'light-bg': '#FFFFFF', 
        'dark-bg': '#1F2937',  
      },
      textColor: {
        'light-text': '#111827', 
        'dark-text': '#D1D5DB', 
      },
    },
  },
  darkMode: 'class', 
  plugins: [],
}
