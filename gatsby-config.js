module.exports = {
	siteMetadata: {
		title: `Troop 485`,
		description: `Join Troop 485 in Cupertino to experience an excellent Scouting experience.`,
		author: `Jeffrey Meng`,
	},
	plugins: [
		`gatsby-plugin-sass`,
		{
			resolve: "gatsby-plugin-simple-analytics",
			options: {
				domain: "sa.t485.org",
			},
		},
		{
			resolve: "gatsby-plugin-heap",
			options: {
				appId:
					process.env.NODE_ENV === "production" ? "2565617774" : "2490812639",
				enableOnDevMode: true,
			},
		},
		{
			resolve: "gatsby-plugin-sentry",
			options: {
				dsn: "https://4c1cd38f8813483e99c206748c124d09@sentry.io/1456506",
				// Optional settings, see https://docs.sentry.io/clients/node/config/#optional-settings
				environment: process.env.NODE_ENV,
				enabled: (() =>
					["production", "stage"].indexOf(process.env.NODE_ENV) !== -1)(),
			},
		},
		{
			resolve: `gatsby-plugin-google-analytics`,
			options: {
				trackingId: "UA-161932786-1",
			},
		},
		`gatsby-plugin-react-helmet`,
		{
			resolve: `gatsby-source-filesystem`,
			options: {
				name: `images`,
				path: `${__dirname}/src/images`,
			},
		},
		{
			resolve: `gatsby-plugin-manifest`,
			options: {
				/* eslint-disable @typescript-eslint/camelcase */
				name: `Troop 485`,
				short_name: `T485`,
				start_url: `/`,
				icon: `src/favicons/apple-touch-icon-180x180.png`,
				background_color: `#eee`,
				theme_color: `#008000`,
			},
		},
		`gatsby-transformer-sharp`,
		`gatsby-plugin-sharp`,

		// this (optional) plugin enables Progressive Web App + Offline functionality
		// To learn more, visit: https://gatsby.dev/offline
		// `gatsby-plugin-offline`,
		`gatsby-plugin-typescript`,
		`gatsby-plugin-postcss`,
	],
};
