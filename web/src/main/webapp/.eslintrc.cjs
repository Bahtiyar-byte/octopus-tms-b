// eslint-disable-next-line no-undef
module.exports = {
  root: true,
  env: { 
    browser: true, 
    es2020: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs', '*.config.js', '*.config.cjs', 'tests/**/*.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
  },
  overrides: [
    {
      files: ['*.cjs', 'jest.config.js', 'postcss.config.cjs'],
      env: {
        node: true,
        commonjs: true
      },
      rules: {
        '@typescript-eslint/no-var-requires': 'off'
      }
    },
    {
      files: ['tests/**/*.js', 'tests/**/*.ts', 'tests/**/*.tsx'],
      env: {
        jest: true,
        node: true
      },
      globals: {
        page: true,
        browser: true,
        context: true,
        jestPuppeteer: true
      }
    }
  ]
}