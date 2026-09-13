/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        blush: {
          DEFAULT: '#FFF7FA',
          100: '#FFEFF5',
          200: '#FFD6E8',
        },
        primary: {
          DEFAULT: '#FF6F91',
          light: '#FF9AB3',
          dark: '#E85A7C',
        },
        lilac: {
          DEFAULT: '#B892FF',
          light: '#D3BBFF',
          dark: '#9A6FE8',
        },
        mint: {
          DEFAULT: '#9AE6B4',
          dark: '#68D391',
        },
        plum: {
          DEFAULT: '#4A2545',
          muted: '#9B7A93',
        },
      },
      fontFamily: {
        display: ['Fredoka', 'sans-serif'],
        body: ['Poppins', 'sans-serif'],
      },
      borderRadius: {
        '3xl': '1.75rem',
        '4xl': '2.25rem',
      },
      boxShadow: {
        soft: '0 8px 30px rgba(255, 111, 145, 0.12)',
        softer: '0 4px 16px rgba(255, 111, 145, 0.08)',
        glow: '0 0 0 4px rgba(184, 146, 255, 0.15)',
      },
      backgroundImage: {
        'bloom-gradient': 'linear-gradient(135deg, #FF6F91 0%, #B892FF 100%)',
        'bloom-gradient-soft': 'linear-gradient(135deg, #FFD6E8 0%, #E5D4FF 100%)',
      },
    },
  },
  plugins: [],
}
