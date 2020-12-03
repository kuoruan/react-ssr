module.exports = {
  plugins: ["stylelint-prettier", "stylelint-order"],
  extends: [
    "stylelint-config-recommended",
    "stylelint-prettier/recommended",
    "stylelint-config-property-sort-order-smacss",
  ],
  rules: {
    "at-rule-no-unknown": [
      true,
      {
        ignoreAtRules: ["extend", "tailwind", "screen"],
      },
    ],
  },
};
