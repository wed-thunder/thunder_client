module.exports = {
  preset: 'ts-jest',
  setupFiles: ['./setup-jest.js'],
  testEnvironment: 'node',
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  transformIgnorePatterns: ['/node_modules/(?!react-native|@react-native)'],
  moduleNameMapper: {
    '@/(.*)$': '<rootDir>/src/$1',
  },
  globals: {
    __DEV__: true,
  },
};
