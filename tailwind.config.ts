import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary-dark": "hsl(0, 85%, 60%)",
        peach: "hsl(0, 85%, 68%)",
        coral: "hsl(358, 70%, 66%)",
      },
    },
  },
  plugins: [],
};

export default config;
