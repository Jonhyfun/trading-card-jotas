import type { Config } from "tailwindcss";
import { Palette } from "./src/utils";

const config: Config = {
  important: true,
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      keyframes: {
        appear: {
          "0%": { opacity: "0" },
          "100%": { opacity: "100" },
        },
        "spin-3d": {
          "0%": { transform: "rotateY(0deg)" },
          "100%": { transform: "rotateY(360deg)" },
        },
      },
      animation: {
        appear: "appear 0.3s normal forwards ease-in",
        "spin-3d": "spin-3d 3s infinite ease-in-out",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      boxShadow: {
        "inset-border-2": "inset 0 0 0 2px black",
        "outset-border-2": "0 0 0 2px black",
      },
      height: {
        selection: "8rem",
      },
      colors: Palette,
    },
  },
  plugins: [],
};
export default config;
