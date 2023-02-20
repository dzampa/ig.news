module.exports = {
    testPathIgnorePatterns: ["/node_module/", "/.next",],
    /*coveragePathIgnorePatterns: ["<rootDir>/src/services/"],*/
    setupFilesAfterEnv: ["<rootDir>/src/tests/setupTests.ts"],
    transform: {
        "^.+\\.(js|jsx|ts|tsx)$": "<rootDir>/node_modules/babel-jest"
    },
    testEnvironment: 'jsdom',
    moduleNameMapper: {
        "\\.(scss|css|sass)$": "identity-obj-proxy"
    }
};