// eslint-disable-next-line @typescript-eslint/no-var-requires
const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    colors: {
      transparent: "transparent",
      primary: colors.indigo,
      secondary: colors.sky,
      accent: colors.amber,
      success: colors.green,
      error: colors.red,
      warning: colors.yellow,
      white: colors.white,
      black: colors.black,
      gray: colors.gray,
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
