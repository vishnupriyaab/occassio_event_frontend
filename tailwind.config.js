/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      fontFamily: {
        kaushan: ['Kaushan Script', 'serif'],
        KayPhoDu: ['Kay Pho Du', 'serif'],
        Roboto: ['Roboto', 'serif'],
        Katibeh: ['Katibeh', 'serif'],
        kalam: ['Kalam', 'cursive']
      },
      colors: {
        adLight: '#F9F7EE',
        adPrimary: '#F8F3D9',
        adSecndary: '#EBE5C2',
        adTertiary: '#B9B28A',
        adQuaternary: '#504B38',
        baseYellow: '#b8860b',
        estimationBlue: '#090841'
      },
    },
  },
  plugins: [],
};
