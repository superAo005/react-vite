
module.exports = {
    env: {
      browser: true,
      es2021: true,
      node: true,
    },
    extends: [
      'eslint:recommended',
      'plugin:react/recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:react-hooks/recommended',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
      ecmaVersion: 13,
    },
    plugins: ['react', '@typescript-eslint'],
    rules: {
      // 这个规则比较奇怪
      //https://github.com/typescript-eslint/typescript-eslint/blob/v5.4.0/packages/eslint-plugin/docs/rules/no-var-requires.md
      '@typescript-eslint/no-var-requires': 0,
      '@typescript-eslint/no-extra-semi': 0,
      'react/prop-types': 0,
      'react/react-in-jsx-scope': 0,
      'react/display-name': 0,
      'react-hooks/rules-of-hooks': 'warn',
      'react-hooks/exhaustive-deps': 'warn',
    },
  }
  