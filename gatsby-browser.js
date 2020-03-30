/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

// import global styles here so they don't get reloaded when the page switches.
import "typeface-muli";
import "./src/styles/style.scss";
import { AuthProvider } from "./src/context/AuthContext";
import React from "react";

/**
 *
 * @param element ReactElement
 * @returns ReactElement
 */
// eslint-disable-next-line react/prop-types
export const wrapRootElement = ({ element }) => (
	<AuthProvider>{element}</AuthProvider>
);
