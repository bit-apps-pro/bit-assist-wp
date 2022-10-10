module.exports = {
  clearMocks: true,
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
  setupFilesAfterEnv: [
    '<rootDir>/jest.setup.ts',
  ],
  transform: {
    '^.+\\.(ts|tsx|js)$': 'ts-jest',
  },
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@components(.*)$': '<rootDir>/src/components$1',
    '^@globalStates(.*)$': '<rootDir>/src/globalStates$1',
    '^@helpers(.*)$': '<rootDir>/src/helpers$1',
    '^@utilities(.*)$': '<rootDir>/src/components/utilities$1',
    '^@icons(.*)$': '<rootDir>/src/icons$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  transformIgnorePatterns: [
    './src/helpers/globalHelpers.js'
    // 'node_modules/(?!@ngrx|(?!deck.gl)|ng-dynamic)',
  ],
}
