/**
 * Layout component that queries for data
 * with Gatsby's StaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/static-query/
 */

import React from "react";
// import { StaticQuery, graphql } from "gatsby"
import { Col, Container, Row } from "react-bootstrap";
import Navbar from "./Navbar";
// fonts and base styles
import "typeface-muli";
// import "typeface-oswald"
import "../../styles/style.scss";

import classNames from "classnames";

interface LayoutProps {
	/**
	 * The content of the page. It will be wrapped in a contianer.
	 */
	children: React.ReactNode;
	/**
	 * The path to the current page. It will be used for the navbar.
	 */
	pageName?: string;
	/**
	 * If provided, the navbar will have a transparent background.
	 */
	transparentNavFooter?: boolean;
	/**
	 * Whether or not to render the admin layout, which includes the special admin navbar.
	 */
	admin?: boolean;
	/**
	 * Whether or not to use the card layout. Defaults to true.
	 */
	card?: boolean;
	/**
	 * Set to false to disable the grey background. Default is true.
	 */
	background?: boolean;
	/**
	 * CSS Classes to pass onto the container closest to the content.
	 */
	className?: string;
	/**
	 * Style to pass onto the container closest to the content.
	 */
	style?: React.CSSProperties;
}

const Layout = ({
	children,
	pageName,
	transparentNavFooter,
	admin,
	card,
	background,
	className,
	style,
}: LayoutProps): React.ReactElement => {
	if (card !== false) {
		card = true;
	}
	if (background !== false) {
		background = true;
	}
	return (
		<>
			<Container
				fluid
				className={classNames(
					"px-0 main",
					background ? "main-background" : ""
				)}
			>
				<Navbar
					pageName={pageName}
					admin={admin}
					transparent={transparentNavFooter}
				/>
				<Row noGutters>
					<Col>
						<Container
							className={classNames(
								"mt-5",
								card ? "main-card" : "",
								className || ""
							)}
							style={style}
						>
							<main>{children}</main>
						</Container>
					</Col>
				</Row>
			</Container>
			<Container fluid className="px-0">
				<Row noGutters>
					<Col className="footer-col">
						<footer
							className={
								transparentNavFooter ? "transparent-footer" : ""
							}
						>
							<span>
								Copyright © 2006
								{new Date().getFullYear() > 2006
									? "-" + new Date().getFullYear()
									: ""}{" "}
								Troop 485, Silicon Valley Monterey Bay Council,
								Boy Scouts of America.
							</span>
						</footer>
					</Col>
				</Row>
			</Container>
		</>
	);
};

// export { Layout };
export default Layout;
