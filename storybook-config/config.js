import { addDecorator, configure } from "@storybook/react";
import { withOptions } from "@storybook/addon-options";
import { action } from "@storybook/addon-actions";
import DocsLogo from "./img/docs_logo.png";

const loadStories = () => {
	require.context("../src", true, /\.(stories)|(story)\.tsx$/);
};

addDecorator(
	withOptions({
		name: "T485 Docs",
		url: "https://t485.org/",
		brandImage: DocsLogo,
		// hierarchySeparator: /\/|\./,
		// hierarchyRootSeparator: /\|/,
	})
);

// automatically import all files ending in *.stories.js
configure(loadStories, module);

// Gatsby's Link overrides:
// Gatsby defines a global called ___loader to prevent its method calls from creating console errors you override it here
global.___loader = {
	enqueue: () => {
		// noop
	},
	hovering: () => {
		// noop
	},
};
// Gatsby internal mocking to prevent unnecessary errors in storybook testing environment
global.__PATH_PREFIX__ = "";
// This is to utilized to override the window.___navigate method Gatsby defines and uses to report what path a Link would be taking us to if it wasn't inside a storybook
window.___navigate = pathname => {
	console.log(".storybook config.js PATHNAME", pathname);
	action("NavigateTo")(pathname);
};
