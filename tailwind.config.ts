import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'fonica-white': '#FFFFFF',
        'fonica-offwhite': '#F7F7F7',
        'fonica-blue': '#0053a0',
        'fonica-blue-deep': '#002D62',
        'fonica-red': '#e53238',
        'fonica-yellow': '#f5af02',
        'fonica-green': '#86b817',
        'fonica-text': '#000000',
        'fonica-muted': '#767676',
        'fonica-border': '#E5E5E5',
        'premium-gold': '#F5AF02', // Adjusted to eBay yellow
        // Legacy mappings for quick transition
        'netflix-black': '#FFFFFF',
        'netflix-dark': '#F7F7F7',
        'netflix-hover': '#E5E5E5',
        'netflix-red': '#0053a0',
        'netflix-text': '#000000',
        'netflix-muted': '#767676',
        'netflix-border': '#E5E5E5',
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'sans-serif'],
        display: ['Inter', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        serif: ['Lora', 'serif'],
      },
    },
  },
  plugins: [],
};
export default config;
