module.exports = {
  testMatch: ["**/tests/*.ts"],
  testPathIgnorePatterns: ["/node_modules/", "dist"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
};
