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
import classNames from "classnames";
import { WindowLocation } from "@reach/router";

// fonts and base styles are in gatsby-browser and gatsby-ssr files, because layout is unmounted and remounted on page loads.

interface LayoutProps {
	/**
	 * The content of the page. It will be wrapped in a contianer.
	 */
	children: React.ReactNode;

	/**
	 * If provided, the navbar will have a transparent background.
	 */
	transparentNavFooter?: boolean;
	/**
	 * Whether or not to render the admin layout, which includes the special admin navbar.
	 */
	admin?: boolean;
	/**
	 * Equivalent to setting noCard, noContainer, and noBackground all to true.
	 * If empty is set and noCard, noContainer, or noBackground is also explicitly set to false (not undefined), then empty has LOWER precedent.
	 * E.g.: <Layout empty noContainer={false}> renders Layout with noCard={true} noContainer={false} noBackground={true}
	 */
	empty?: boolean;
	/**
	 * If set to true, no card will be rendered. If undefined or false, a card will be shown.
	 */
	noCard?: boolean;
	/**
	 * If set to true, the page will not be wrapped in utility components (row, col, container) that help with common layouts.
	 * If undefined or false, then the content will be wrapped in a container.
	 */
	noContainer?: boolean;
	/**
	 * Set to true to disable the grey background. If undefined or false, it will be rendered.
	 */
	noBackground?: boolean;
	/**
	 * CSS Classes to pass onto the container closest to the content.
	 */
	className?: string;
	/**
	 * CSS Classes to apply to the footer.
	 */
	footerClassName?: string;
	/**
	 * Style to pass onto the container closest to the content.
	 */
	style?: React.CSSProperties;

	/**
	 * Renders a card narrower than usual. Typically used by auth pages.
	 */
	narrow?: boolean;
}

const Layout = ({
	children,
	location,
	transparentNavFooter,
	admin,
	empty,
	noCard,
	noContainer,
	noBackground,
	className,
	style,
	narrow,
	footerClassName,
}: LayoutProps): React.ReactElement => {
	// For increased readability

	// if empty is set, then there is background == false as long as noBackground is not explicitly set to false (not undefined)
	const background = empty ? noBackground === false : !noBackground;
	const card = empty ? noCard === false : !noCard;
	const container = empty ? noContainer === false : !noContainer;

	return (
		<>
			<Container
				fluid
				className={classNames("px-0 main", background ? "main-background" : "")}
			>
				<Navbar
					location={location}
					admin={admin}
					transparent={transparentNavFooter}
				/>
				{container ? (
					<Row noGutters>
						<Col>
							<Container
								className={classNames(
									"mt-5",
									card ? "main-card" : "",
									className || ""
								)}
								style={{
									...(narrow
										? {
												maxWidth: "600px",
										  }
										: {}),
									...style,
								}}
							>
								<main>{children}</main>
							</Container>
						</Col>
					</Row>
				) : (
					<div className={className}>{children}</div>
				)}
			</Container>
			<Container fluid className="px-0">
				<Row noGutters>
					<Col className="footer-col">
						<footer
							className={classNames(
								transparentNavFooter ? "transparent-footer" : "",
								footerClassName
							)}
						>
							<span>
								Copyright &copy; 2006
								{new Date().getFullYear() > 2006
									? "-" + new Date().getFullYear()
									: ""}{" "}
								Troop 485, Silicon Valley Monterey Bay Council, Boy Scouts of
								America.
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
