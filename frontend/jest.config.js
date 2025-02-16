export default {
  clearMocks: true,
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json'
    }
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@components(.*)$': '<rootDir>/src/components$1',
    '^@globalStates(.*)$': '<rootDir>/src/globalStates$1',
    '^@helpers(.*)$': '<rootDir>/src/helpers$1',
    '^@icons(.*)$': '<rootDir>/src/icons$1',
    '^@utilities(.*)$': '<rootDir>/src/components/utilities$1'
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|tsx|js)$': 'ts-jest'
  },
  transformIgnorePatterns: [
    './src/helpers/globalHelpers.js'
    // 'node_modules/(?!@ngrx|(?!deck.gl)|ng-dynamic)',
  ]
}
