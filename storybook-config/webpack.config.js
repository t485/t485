const path = require("path");

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

	// config.module.rules[0].use[0].options.plugins = [
	//   // use @babel/plugin-proposal-class-properties for class arrow functions
	//   require.resolve("@babel/plugin-proposal-class-properties"),
	//   // use babel-plugin-remove-graphql-queries to remove static queries from components when rendering in storybook
	//   require.resolve("babel-plugin-remove-graphql-queries"),
	//   require.resolve("babel-plugin-macros"),
	//   require.resolve("babel-plugin-tailwind-components"),
	//   require.resolve("@babel/plugin-syntax-object-rest-spread"),
	// ]

	// Prefer Gatsby ES6 entrypoint (module) over commonjs (main) entrypoint
	config.resolve.mainFields = ["browser", "module", "main"];

	config.module.rules.push({
		test: /\.(ts|tsx)$/,
		use: [
			{
				loader: require.resolve("babel-loader"),
				options: {
					presets: [["react-app", { flow: false, typescript: true }]],
				},
			},
			require.resolve("react-docgen-typescript-loader"),
		],
	});

	// add typescript support
	config.resolve.extensions.push(".ts", ".tsx");
	return config;
};
