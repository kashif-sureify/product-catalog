module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    "airbnb",
    "airbnb-typescript",
    "plugin:react-hooks/recommended",
    "plugin:react/jsx-runtime",
    "plugin:prettier/recommended",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.eslint.json",
    tsconfigRootDir: __dirname,
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["react", "@typescript-eslint"],
  rules: {
    "prettier/prettier": "warn",
    "react/jsx-filename-extension": [1, { extensions: [".tsx"] }],
    "react/react-in-jsx-scope": "off",
    "@typescript-eslint/no-unused-vars": ["warn"],
    "import/prefer-default-export": "off",
    "no-console": "warn",
    "import/no-extraneous-dependencies": "off",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
