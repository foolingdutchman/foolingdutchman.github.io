/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './themes/pretext/**/*.{ejs,js,ts}',
    './themes/pretext/layout/**/*.{ejs,html}',
    './themes/pretext/source/**/*.{js,css}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

