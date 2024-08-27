// noinspection JSUnusedGlobalSymbols
export default {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
  ],
  // ignorePatterns: ["dist", ".eslintrc.cjs"],
  parser: "@typescript-eslint/parser",
  plugins: ["react-refresh", "react"],
  rules: {
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
    "react/jsx-curly-brace-presence": [
      "warn",
      { props: "always", children: "never" },
    ],
    "react/jsx-one-expression-per-line": ["warn", { allow: "literal" }],
    "react/jsx-closing-bracket-location": ["warn", "tag-aligned"],
    "react/jsx-closing-tag-location": ["warn"],
    "react/jsx-equals-spacing": ["warn", "never"],
    "react/jsx-max-props-per-line": ["warn", { maximum: 3 }],
    "react/react-in-jsx-scope": [0],
    "react/no-children-prop": [0],
    "react/self-closing-comp": ["warn", { component: true, html: true }],
    "react/boolean-prop-naming": ["warn"],
  },
}
