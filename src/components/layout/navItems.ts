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
		name: "Directory",
		path: "/directory",
	},
	{
		name: "Events",
		path: "/events",
	},
	{
		name: "About",
		dropdown: true,
		children: [
			{
				name: "PLC",
				path: "/about/plc",
			},
			{
				name: "Troop Jobs",
				path: "/about/troop-jobs",
			},
			{
				name: "Merit Badges",
				path: "/about/merit-badges",
			},
		],
	},
	{
		name: "Resources",
		dropdown: true,
		children: [
			{
				name: "Link Shortener",
				path: "/resources/links",
			},
		],
	},
];
