module.exports = {
  env: {
    es2021: true,
    node: true,
    jest: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint', 'react-hooks', 'prettier'],
  rules: {
    // 들여쓰기 (기본 2칸), Switch Case의 경우 1칸
    indent: ['error', 2, { SwitchCase: 1 }],
    // 줄바꿈 스타일, 유닉스 라인 엔딩 \n
    'linebreak-style': ['error', 'unix'],
    // 작은 따음표 사용
    quotes: ['error', 'single', { avoidEscape: true }],
    // 세미콜론
    semi: ['error', 'always'],
    'react-hooks/rules-of-hooks': 'error',
    // useEffect내에 사용하고 있는 state를 배열안에 추가시켜 달라는 의미
    'react-hooks/exhaustive-deps': 'warn',
    'react/jsx-filename-extension': ['error', { extensions: ['.tsx'] }],
    'react/prop-types': ['error', { ignore: ['navigation'] }],
    // any 관련
    '@typescript-eslint/no-explicit-any': 'off',
    // Disallows calling any variable that is typed as any.
    '@typescript-eslint/no-unsafe-call': 'off',
    // Disallows member access on a value with type any
    '@typescript-eslint/no-unsafe-member-access': 'off',
    // Disallows returning a value with type any from a function.
    '@typescript-eslint/no-unsafe-return': 'error',
    // Disallows assigning a value with type any to variables and properties.
    '@typescript-eslint/no-unsafe-assignment': 'error',
    // Requires explicit return types on functions and class methods.
    '@typescript-eslint/explicit-function-return-type': ['error', { allowExpressions: true }],
    'prettier/prettier': 'error',
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['error'],
    eqeqeq: ['error', 'smart'],
    curly: ['error', 'all'],
    // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/order.md
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          ['index', 'sibling'],
          'parent',
          'internal',
          'type',
          'object',
        ],
        pathGroups: [
          {
            pattern: 'react',
            group: 'external',
            position: 'before',
          },
        ],
        alphabetize: {
          order: 'asc',
        },
        'newlines-between': 'always',
        warnOnUnassignedImports: true,
      },
    ],
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': ['error'],
    'import/extensions': 0,
    'import/no-unresolved': 0,
    'react/style-prop-object': [
      'error',
      {
        allow: ['StatusBar'],
      },
    ],
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['error'],
    'no-param-reassign': [
      'error',
      { props: true, ignorePropertyModificationsFor: ['self', 'config'] },
    ],
    camelcase: ['error', { allow: ['jwt_decode'] }],
    '@typescript-eslint/no-unsafe-assignment': 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    indent: 'off',
    'lines-between-class-members': 'off',
    'react/require-default-props': 'off',
    'react/no-unstable-nested-components': 'off',
    'react/jsx-props-no-spreading': 'off',
  },
  settings: {
    react: {
      version: 'detect',
    },
    typescript: { project: 'tsconfig.json' },
  },
  // 'true' if you can assign the variable to something else, 'false' if it shouldn't be reassigned
  globals: {
    __DEV__: false,
    NestAPI: false,
    NestListResponse: false,
  },
};
