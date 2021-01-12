module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parser: "@typescript-eslint/parser",
  plugins: ["prettier", "import"],
  extends: [
    "eslint:recommended",
    "plugin:prettier/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
  },
  rules: {
    "import/order": [
      "error",
      {
        groups: [
          "builtin",
          "external",
          "internal",
          ["parent", "sibling"],
          "index",
          "object",
          "unknown",
        ],
        alphabetize: { order: "asc", caseInsensitive: true },
        "newlines-between": "always",
      },
    ],
    "import/dynamic-import-chunkname": [
      "error",
      {
        importFunctions: ["dynamicImport"],
        webpackChunknameFormat: "[a-zA-Z0-9-/_]+",
      },
    ],
  },
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      env: {
        es6: true,
        node: true,
        browser: true,
      },
      parser: "@typescript-eslint/parser",
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
      plugins: [
        "prettier",
        "@typescript-eslint",
        "react",
        "react-hooks",
        "import",
      ],
      extends: [
        "eslint:recommended",
        "plugin:prettier/recommended",
        "plugin:react/recommended",
        "plugin:react-hooks/recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:import/errors",
        "plugin:import/warnings",
        "plugin:import/typescript",
      ],
      rules: {
        "@typescript-eslint/no-var-requires": ["off"],
        "@typescript-eslint/no-explicit-any": ["off"],
      },
      settings: {
        react: {
          version: "detect",
        },
        "import/resolver": ["node", "typescript"],
      },
    },
  ],
};
