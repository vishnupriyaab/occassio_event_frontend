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
      },
      colors: {
        adPrimary : '#F8F3D9',
        adSecndary: '#EBE5C2',
        adTertiary: '#B9B28A',
        adQuaternary: '#504B38',
      }
    },
  },
  plugins: [],
}