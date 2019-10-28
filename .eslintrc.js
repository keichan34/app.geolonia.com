module.exports = {
  extends: [
    "react-app",
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  plugins: ["react", "@typescript-eslint"],
  env: {
    browser: true,
    jest: true
  },
  rules: {
    "no-console": "warn",
    "@typescript-eslint/ban-ts-ignore": "warn",
    "@typescript-eslint/camelcase": "off"
  },
  settings: {
    react: {
      pragma: "React",
      version: "detect"
    }
  },
  parser: "@typescript-eslint/parser"
};
