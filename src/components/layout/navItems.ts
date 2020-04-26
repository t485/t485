export default [
	{
		name: "About Us",
		path: "/about",
	},
	{
		name: "New Scouts",
		path: "/new-scouts",
	},
	{
		name: "Calendar",
		path: "/calendar",
	},
	{
		name: "Events",
		path: "/events",
	},
	{
		name: "Resources",
		dropdown: true,
		children: [
			{
				name: "Link Shortener",
				path: "/resources/linkshortener",
			},
		],
	},
];
