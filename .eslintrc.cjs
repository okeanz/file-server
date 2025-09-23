module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    sourceType: 'module',
    ecmaVersion: 'latest'
  },
  env: {
    node: true,
    es2022: true
  },
  plugins: ['@typescript-eslint', 'prettier', 'node'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:node/recommended',
    'plugin:prettier/recommended'
  ],
  rules: {
    'prettier/prettier': 'error',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-function-return-type': 'off',
    'node/no-unsupported-features/es-syntax': ['error', { ignores: ['modules'] }],
    'node/no-missing-import': 'off'
  }
};
