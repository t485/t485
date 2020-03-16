module.exports = {
	siteMetadata: {
		title: `Troop 485`,
		description: `The official BSA Troop 485 website, version 2`,
		author: `Jeffrey Meng`,
	},
	plugins: [
		`gatsby-plugin-sass`,
		`gatsby-plugin-react-helmet`,
		{
			resolve: `gatsby-source-filesystem`,
			options: {
				name: `images`,
				path: `${__dirname}/src/images`,
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
