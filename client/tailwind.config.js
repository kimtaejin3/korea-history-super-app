/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{ts,tsx}',
    './widgets/**/*.{ts,tsx}',
    './features/**/*.{ts,tsx}',
    './entities/**/*.{ts,tsx}',
    './shared/**/*.{ts,tsx}',
  ],
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
        serif: ['Pretendard-Bold'],
        'serif-regular': ['Pretendard-Regular'],
        'serif-black': ['Pretendard-ExtraBold'],
        sans: ['Pretendard-Medium'],
        'sans-bold': ['Pretendard-SemiBold'],
        mono: ['JetBrainsMono_400Regular'],
        'mono-bold': ['JetBrainsMono_700Bold'],
      },
    },
  },
  plugins: [],
};
