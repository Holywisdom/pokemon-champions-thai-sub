/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Noto Sans Thai"', '"Inter"', 'system-ui', 'sans-serif'],
        display: ['"Bebas Neue"', '"Noto Sans Thai Display"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        // Pokemon Champions branding
        champ: {
          bg: '#0a0a0f',
          surface: '#13131a',
          card: '#1a1a24',
          border: '#262633',
          dim: '#3a3a48',
          text: '#e8e8f0',
          muted: '#9090a0',
          gold: '#ffd166',
          ember: '#ff6b35',
          crimson: '#e63946',
          electric: '#ffdd00',
          ocean: '#4cc9f0',
          poison: '#b5179e',
        },
        // Pokemon type colors (official-ish)
        type: {
          normal: '#a8a878',
          fire: '#f08030',
          water: '#6890f0',
          electric: '#f8d030',
          grass: '#78c850',
          ice: '#98d8d8',
          fighting: '#c03028',
          poison: '#a040a0',
          ground: '#e0c068',
          flying: '#a890f0',
          psychic: '#f85888',
          bug: '#a8b820',
          rock: '#b8a038',
          ghost: '#705898',
          dragon: '#7038f8',
          dark: '#705848',
          steel: '#b8b8d0',
          fairy: '#ee99ac',
        },
      },
      backgroundImage: {
        'champ-radial':
          'radial-gradient(ellipse at top, rgba(255, 107, 53, 0.15), transparent 60%), radial-gradient(ellipse at bottom right, rgba(230, 57, 70, 0.12), transparent 50%)',
        'champ-hero':
          'linear-gradient(135deg, #0a0a0f 0%, #1a0a14 50%, #0a0a0f 100%)',
        'gold-shine':
          'linear-gradient(135deg, #ffd166 0%, #ff9a3c 50%, #ff6b35 100%)',
        'ember-glow':
          'linear-gradient(135deg, #ff6b35 0%, #e63946 100%)',
      },
      boxShadow: {
        'card': '0 1px 0 rgba(255,255,255,.04) inset, 0 8px 24px rgba(0,0,0,.35)',
        'glow-gold': '0 0 20px rgba(255, 209, 102, 0.35)',
        'glow-ember': '0 0 24px rgba(255, 107, 53, 0.45)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideUp: {
          '0%': { opacity: 0, transform: 'translateY(12px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 12px rgba(255, 209, 102, 0.35)' },
          '50%': { boxShadow: '0 0 24px rgba(255, 209, 102, 0.6)' },
        },
      },
    },
  },
  plugins: [],
};
