import type { Config } from "tailwindcss";
import { Palette } from "./src/utils/any";

const config: Config = {
  important: true,
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        appear: {
          '0%': { opacity: '0' },
          '100%': { opacity: '100' }
        }
      },
      animation: {
        appear: 'appear 0.3s normal forwards ease-in'
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      boxShadow: {
        'inset-border-2': 'inset 0 0 0 2px black',
        'outset-border-2': '0 0 0 2px black',
      },
      colors: Palette
    },
  },
  plugins: [],
};
export default config;
