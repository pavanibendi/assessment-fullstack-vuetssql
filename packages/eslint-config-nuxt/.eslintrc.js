module.exports = {
  root: true,
  extends: ["plugin:prettier/recommended"],
  rules: {
    "prettier/prettier": [
      "warn",
      {
        semi: true,
        arrowParens: "always",
        singleQuote: false,
        endOfLine: "auto",
        singleAttributePerLine: true,
      },
    ],
  },
};
