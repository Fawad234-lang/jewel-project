// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  // IMPORTANT: We are NOT using Tailwind's built-in `darkMode: 'class'` here for this alternative method.
  // Instead, we'll manage theme via a data attribute and CSS variables.
  // Ensure this line is commented out or removed if it was present.
  // darkMode: 'class',

  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // No need to define colors here if you're using CSS variables directly in JSX styles
    },
  },
  plugins: [],
}