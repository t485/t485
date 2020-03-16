const path = require("path");
// const HappyPack = require('happypack')

module.exports = ({ config }) => {
	//https://github.com/storybookjs/storybook/issues/6204#issuecomment-478998529
	delete config.resolve.alias["core-js"];

	config.module.rules = config.module.rules.filter(
		f => f.test.toString() !== "/\\.css$/"
	);

	config.module.rules.push({
		test: /\.s?css$/,
		use: [
			"style-loader",
			{ loader: "css-loader", options: { importLoaders: 2 } },
			{
				loader: "postcss-loader",
				options: {
					ident: "postcss",
					plugins: loader => [
						require("postcss-import")({
							root: loader.resourcePath,
						}),
						require("cssnano")(),
					],
				},
			},
			"sass-loader",
		],

		include: path.resolve(__dirname, "../"),
	});
	// Transpile Gatsby module because Gatsby includes un-transpiled ES6 code.
	config.module.rules[0].exclude = [/node_modules\/(?!(gatsby.+?)\/)/];

	// use installed babel-loader which is v8.0-beta (which is meant to work with @babel/core@7)
	config.module.rules[0].use[0].loader = require.resolve("babel-loader");

	// use @babel/preset-react for JSX and env (instead of staged presets)
	config.module.rules[0].use[0].options.presets = [
		require.resolve("@babel/preset-react"),
		require.resolve("@babel/preset-env"),
		require.resolve("@babel/preset-typescript"),
	];

	// Prefer Gatsby ES6 entrypoint (module) over commonjs (main) entrypoint
	config.resolve.mainFields = ["browser", "module", "main"];

	return config;
};
