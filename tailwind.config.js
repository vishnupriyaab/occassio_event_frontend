/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        kaushan: ['Kaushan Script', 'serif'],
        KayPhoDu: ['Kay Pho Du', 'serif'],
        Roboto: ['Roboto', 'serif'],
        Katibeh: ['Katibeh', 'serif']  ,
      }
    },
  },
  plugins: [],
}