import { defineConfig } from 'eslint';

export default defineConfig({
  ignores: ["**/node_modules/**", "**/dist/**"],
  files: ["**/*.{js,mjs,cjs,ts}"],
  extends: ["plugin:react/recommended", "plugin:@typescript-eslint/recommended"],
  plugins: ["react", "@typescript-eslint"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: {
      jsx: true
    }
  },
  rules: {
    "no-unused-vars": "warn",
    "arrow-body-style": ["error", "always"],
    '@typescript-eslint/no-unused-expressions': 'off',
  },
});
