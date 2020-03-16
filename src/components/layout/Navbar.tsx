import React, { ReactElement, ReactNode } from "react";
import { Link } from "gatsby";
import { navigate } from "gatsby-link";
import { Nav, Navbar as BootstrapNavbar, NavDropdown } from "react-bootstrap";
import { useAuthState } from "../../components/auth";

function NavbarLink(props: {
	/**
	 * The page the link should redirect to.
	 */
	page: string;
	/**
	 * The text of the navbar link.
	 */
	children: ReactNode;
	/**
	 * Whether the link should be a dropdown link
	 */
	dropdown?: boolean;
}): ReactElement {
	// Gatsby link element doesn't work well with our storybook config
	const linkProps = {
		eventKey: props.page,
		onClick: (): void => {
			navigate("/" + props.page);
		},
	};
	if (props.dropdown) {
		return (
			<>
				<NavDropdown.Item {...linkProps}>{props.children}</NavDropdown.Item>
			</>
		);
	} else {
		return (
			<Nav.Item>
				<Nav.Link {...linkProps}>{props.children}</Nav.Link>
			</Nav.Item>
		);
	}
}

const AuthDropdown = (): ReactElement => {
	const [user, loading, error] = useAuthState();

	if (loading) {
		return (
			<NavDropdown id={"authDropdown"} title={"Loading..."} alignRight>
				<NavDropdown.Header>Loading...</NavDropdown.Header>
			</NavDropdown>
		);
	}
	if (user) {
		return (
			<NavDropdown
				id={"authDropdown"}
				title={`Hello, ${user.displayName || user.email}`}
				alignRight
			>
				<NavDropdown.Header>
					You are logged in as <b>{user.displayName || user.email}</b>
				</NavDropdown.Header>
				<NavbarLink page="/account" dropdown>
					Account Settings
				</NavbarLink>
				<NavDropdown.Divider />
				<NavbarLink page="/account/logout" dropdown>
					Logout
				</NavbarLink>
			</NavDropdown>
		);
	}
	if (error) {
		return (
			<NavDropdown id={"authDropdown"} title={"Account Error"} alignRight>
				<NavDropdown.Header>
					There was an error logging you in: error.code
				</NavDropdown.Header>
				<NavbarLink page="/account/login" dropdown>
					Login Again
				</NavbarLink>
			</NavDropdown>
		);
	}
	return (
		// <NavDropdown id={"authDropdown"} title={"NLI"} alignRight>
		//   <NavDropdown.Header>You are not logged in</NavDropdown.Header>
		<NavbarLink page="/account/login">Login</NavbarLink>
		// </NavDropdown>
	);
};

interface PropDef {
	/**
	 * The name of the page that should be active. This should be the path to the page.
	 * For example, on a page /navbarDemo, the value should be `/navbarDemo`. This is used to determine which nav link should be highlighted.
	 */
	pageName?: string;
	/**
	 * Whether or not the admin variant of the navbar should be rendered instead of the normal component.
	 */
	admin?: boolean;
	/**
	 * Whether or not the navbar should be transparent
	 */
	transparent?: boolean;
}

export const Navbar = ({
	pageName,
	admin,
	transparent,
}: PropDef): ReactElement => {
	return (
		<>
			<BootstrapNavbar
				bg="dark"
				variant="dark"
				expand="lg"
				id="site-navbar"
				className={transparent ? "transparent-navbar" : ""}
			>
				{/* <Container> */}
				<Link to="/" className="link-no-style">
					<BootstrapNavbar.Brand as="span">
						BSA Troop 485{" "}
						{admin ? <span style={{ color: "#99ccff" }}>| Admin</span> : <></>}
					</BootstrapNavbar.Brand>
				</Link>
				<BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
				<BootstrapNavbar.Collapse
					id="basic-navbar-nav"
					className="justify-content-end"
				>
					<Nav activeKey={pageName}>
						<NavbarLink page="/page-2">Page 2</NavbarLink>
						<NavbarLink page="/404">Link Name 2</NavbarLink>

						<AuthDropdown />
					</Nav>
				</BootstrapNavbar.Collapse>
				{/* </Container> */}
			</BootstrapNavbar>
		</>
	);
};
export default Navbar;
