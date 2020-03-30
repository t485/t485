import React, { ReactElement, ReactNode } from "react";
import { Link } from "gatsby";
import { Nav, Navbar as BootstrapNavbar, NavDropdown } from "react-bootstrap";
import AuthContext from "../../context/AuthContext";
import navItems from "./navItems";
import { firebase, useFirebaseInitializer } from "../../firebase";

declare const heap: {
	identify: (identifier: string) => void;
	addUserProperties: (properties: object) => void;
}; // imported via gatsby

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
	if (props.dropdown) {
		return (
			<>
				<NavDropdown.Item eventKey={props.page} as={Link} to={props.page}>
					{props.children}
				</NavDropdown.Item>
			</>
		);
	} else {
		return (
			<Nav.Item>
				<Nav.Link eventKey={props.page} to={props.page} as={Link}>
					{props.children}
				</Nav.Link>
			</Nav.Item>
		);
	}
}

// Also handles heap analytics. TODO: move analtyics out?
const AuthDropdown = (): ReactElement => {
	const { user, loading, error } = React.useContext(AuthContext);
	const firebaseReady = useFirebaseInitializer();
	React.useEffect(() => {
		if (loading || !firebaseReady) return;
		if (error) {
			heap.addUserProperties({
				hadNavbarAuthError: true,
			});
			return;
		}
		if (!user || !user.uid) {
			heap.addUserProperties({
				hasAccount: false,
			});
			return;
		}

		heap.identify("user-" + user.uid);
		firebase
			.firestore()
			.collection("users")
			.doc(user.uid)
			.get()
			.then(
				(
					snapshot: firebase.firestore.DocumentSnapshot<{
						admin?: boolean;
						memberType?: string;
						jobs?: string[];
						roles?: string[];
						permissions?: string[];
					}>
				) => {
					const data = snapshot.data();
					if (!data) return;
					heap.addUserProperties({
						hasAccount: true,
						isAdmin: data.admin,
						memberType: data.memberType, // should be "scout" or "parent"
						jobs: data.jobs,
						roles: data.roles,
						permissions: data.permissions,
					});
				}
			);
	}, [user, loading, error, firebaseReady]);
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
				expand="md"
				id="site-navbar"
				className={transparent ? "transparent-navbar" : ""}
				fixed="top"
			>
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
						{navItems.map((item, i) => (
							<NavbarLink key={i} page={item.path}>
								{item.name}
							</NavbarLink>
						))}
						<AuthDropdown />
					</Nav>
				</BootstrapNavbar.Collapse>
			</BootstrapNavbar>
		</>
	);
};
export default Navbar;
