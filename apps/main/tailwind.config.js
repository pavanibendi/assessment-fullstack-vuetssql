// eslint-disable-next-line
const myConfig = require("@mono/ui/tailwind.config");

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...myConfig,
  content: [
    "./src/**/*.{js,ts,jsx,tsx,vue,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx,vue,mdx}",
  ],
};
