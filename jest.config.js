module.exports = {
	preset: "ts-jest",
	setupFilesAfterEnv: ["jest-enzyme", "jest-chain"],
	testEnvironment: "enzyme",
	setupFiles: ["./src/setupTests.ts"],
	modulePathIgnorePatterns: [
		"<rootDir>/build/",
		"<rootDir>/node_modules/",
		"<rootDir>/.cache/",
		"<rootDir>/.stryker-tmp/",
	],
};
