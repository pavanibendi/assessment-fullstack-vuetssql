module.exports = {
  root: true,
  extends: ["@nuxtjs/eslint-config-typescript", "plugin:prettier/recommended"],
  rules: {
    "@typescript-eslint/consistent-type-imports": [
      "warn",
      {
        fixStyle: "inline-type-imports",
      },
    ],
    "no-console": "off",
    "prettier/prettier": [
      "warn",
      {
        plugins: ["prettier-plugin-tailwindcss"],
        semi: true,
        arrowParens: "always",
        singleQuote: false,
        endOfLine: "auto",
        singleAttributePerLine: true,
      },
    ],
    "vue/attribute-hyphenation": ["error", "never"],
    "vue/v-on-event-hyphenation": ["error", "never"],
  },
};
