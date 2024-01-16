module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ["plugin:@typescript-eslint/recommended", "prettier"],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "eslint-plugin-prettier"],
  rules: {
    "@typescript-eslint/consistent-type-imports": [
      "warn",
      {
        fixStyle: "inline-type-imports",
      },
    ],
    "prettier/prettier": [
      "warn",
      {
        semi: true,
        arrowParens: "always",
        singleQuote: false,
        endOfLine: "auto",
        trailingComma: "es5",
      },
    ],
  },
};
