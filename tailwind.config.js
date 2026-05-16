/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        paper: '#FBFBF9',
        paperWarm: '#F3F2EE',
        ink: '#141413',
        inkSoft: '#36363A',
        mute: '#86858A',
        line: 'rgba(20,20,22,0.08)',
        lineSoft: 'rgba(20,20,22,0.04)',
        red: {
          DEFAULT: '#C8442A',
          dark: '#9C2F1B',
        },
        green: {
          DEFAULT: '#4F6B5C',
          dark: '#3D5249',
        },
        brown: '#7A6450',
        navy: '#1F3A52',
      },
      fontFamily: {
        serif: ['NotoSerifKR_700Bold'],
        'serif-regular': ['NotoSerifKR_400Regular'],
        'serif-black': ['NotoSerifKR_900Black'],
        sans: ['NotoSansKR_500Medium'],
        'sans-bold': ['NotoSansKR_700Bold'],
        mono: ['JetBrainsMono_400Regular'],
        'mono-bold': ['JetBrainsMono_700Bold'],
      },
    },
  },
  plugins: [],
};
