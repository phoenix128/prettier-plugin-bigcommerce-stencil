module.exports = {
    transform: {
        '^.+\\.js$': 'babel-jest'
    },
    testEnvironment: 'node',
    testPathIgnorePatterns: ['node_modules', 'dist'],
    watchPathIgnorePatterns: ['node_modules', 'dist'],
    verbose: true
};
