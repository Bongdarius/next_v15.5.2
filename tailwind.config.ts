import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  plugins: [
    // require("tailwindcss-animate"),
    // require("tw-animate-css"), // 이렇게 플러그인으로 등록
  ],
};
export default config;
