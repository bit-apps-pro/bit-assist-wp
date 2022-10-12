module.exports = {
  env: {
    browser: true,
    es6: true,
    commonjs: true,
  },
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    requireConfigFile: false,
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 8,
    sourceType: 'module',
    settings: {
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx'],
      },
      'import/resolver': {
        typescript: {},
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
    },
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:import/errors',
    'plugin:jsx-a11y/recommended',
    'airbnb',
    'airbnb-typescript',
    'react-app',
    'plugin:import/warnings',
    'plugin:import/typescript',
  ],
  plugins: ['@typescript-eslint', 'react', 'react-hooks', 'jsx-a11y', 'import', 'promise'],
  rules: {
    'no-param-reassign': 0,
    'template-curly-spacing': 'off',
    indent: [
      'error',
      2,
      {
        SwitchCase: 1,
      },
    ],
    'react/jsx-filename-extension': [
      1,
      {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    ],
    semi: ['error', 'never'],
    'react/destructuring-assignment': 0,
    'arrow-parens': 0,
    'react/prop-types': 0,
    'max-len': [
      'error',
      {
        code: 350,
      },
    ],
    'linebreak-style': ['error', 'unix'],
    'react-hooks/exhaustive-deps': 'warn',
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    allowImplicit: 0,
    camelcase: 0,
    'object-curly-newline': [
      'error',
      {
        ImportDeclaration: 'never',
        ExportDeclaration: 'never',
        ObjectPattern: {
          multiline: false,
          minProperties: 5,
          consistent: true,
        },
        ObjectExpression: {
          multiline: true,
          minProperties: 5,
          consistent: true,
        },
      },
    ],
    'array-callback-return': 'off',
    'consistent-return': 'off',
    'newline-per-chained-call': [
      'error',
      {
        ignoreChainWithDepth: 4,
      },
    ],
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: ['**/*.test.tsx', '**/*.test.ts'],
      },
    ],
    '@typescript-eslint/indent': [2, 2],
    '@typescript-eslint/semi': 'off',
  },
}
