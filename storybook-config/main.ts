module.exports = {
	stories: ["../src/**/*.(stories|story).(j|tsx?|mdx)"],
	addons: [
		{
			name: "@storybook/preset-typescript",
			options: {
				tsLoaderOptions: {
					transpileOnly: true,
				},
				forkTsCheckerWebpackPluginOptions: {
					memoryLimit: 4096,
				},
			},
		},
		"@storybook/addon-docs",
		"@storybook/addon-actions",
		"@storybook/addon-options",
		"@storybook/addon-knobs",
		"@storybook/addon-links",
		`@storybook/addon-storysource`,
	],
};
