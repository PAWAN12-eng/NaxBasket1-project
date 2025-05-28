/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {  // ✅ Wrap colors inside this object
        "primary-200": "#ffbf00",  // Fixed typo: "ffbg00" -> "ffbf00"
        "primary-100": "#ffc929",
        "secondary-200": "#00b050", // Fixed typo: "secondry" -> "secondary"
        "secondary-100": "#0b1a78",
      },
    },
  },
  plugins: [],
};
