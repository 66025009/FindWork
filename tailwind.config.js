/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      spacing: { // ความสูง
        '70': '70px',
      },

      colors:{
        indigo:'#092B44', // สีคราม
        white:'#ffffff',
        blue:'#0044cc',
        sky:'#1a73e8',
        lightgray:'#dee0e2',
        green: '#2ba745',
        greenhover: '#218838',
      },

      fontSize: {
        's':'15px',
        'l':'20px',
        'xxl':'30px',
        'xl':'50px'
      }
    },
  },
  plugins: [require("daisyui")],
}

