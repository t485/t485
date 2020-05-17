import React, { ReactElement, ReactNode } from "react";
import { Link } from "gatsby";
import { Nav, Navbar as BootstrapNavbar, NavDropdown } from "react-bootstrap";
import AuthContext from "../../context/AuthContext";
import navItems from "./navItems";
import { useFirebase } from "../../firebase";
import { globalHistory, WindowLocation } from "@reach/router";
import classNames from "classnames";
import { firebase as FirebaseType } from "firebase";

const { location } = globalHistory;

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
				<NavDropdown.Item as={Link} to={props.page}>
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
	const { user, loading, error, setupComplete } = React.useContext(AuthContext);

	const firebase = useFirebase();
	// TODO: finish setup button, and redirect to finish setup upon login, and fix auth context to not give user unless setup is complete?
	React.useEffect(() => {
		if (loading || !firebase) return;
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
		console.log(location.pathname == "/account/logout");
		firebase
			.firestore()
			.collection("users")
			.doc(user.uid)
			.get()
			.then(
				(
					snapshot: FirebaseType.firestore.DocumentSnapshot<{
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
			)
			.catch(e => {
				if (
					e.code == "permission-denied" &&
					location.pathname == "/account/logout"
				) {
					// do nothing because when logging out, the user will be logged out
					// after the firebase call is made, but before it finishes. Thus, the request
					// will be sent, but will also fail
					return;
				}
				console.error(e); // other errors are cause for concern.
			});
	}, [user, loading, error, firebase]);
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
				title={`Hello, ${(setupComplete
					? user.displayName
					: user.displayName.split(" ")[0]) || user.email}${
					setupComplete ? "" : " (Needs Setup)"
				}`}
				alignRight
			>
				<NavDropdown.Header>
					You are logged in as <b>{user.displayName || user.email}</b>
				</NavDropdown.Header>
				{!setupComplete && (
					<NavbarLink page="/account" dropdown>
						Finish setting up your account
					</NavbarLink>
				)}
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

interface NavbarProps {
	/**
	 * Whether or not the admin variant of the navbar should be rendered instead of the normal component.
	 */
	admin?: boolean;
	/**
	 * Whether or not the navbar should be transparent
	 */
	transparent?: boolean;
}

export const Navbar = ({ admin, transparent }: NavbarProps): ReactElement => {
	const [float, setFloat] = React.useState(false);
	const path = location.pathname?.replace(/\/$/, ""); // remove trailing slash
	// console.log(path);
	React.useEffect(() => {
		const handler = (): void => {
			setFloat(window.scrollY > 10);
		};
		window.addEventListener("scroll", handler);
		return (): void => {
			window.removeEventListener("scroll", handler);
		};
	}, []);
	return (
		<>
			<BootstrapNavbar
				bg="dark"
				variant="dark"
				expand="md"
				id="site-navbar"
				className={classNames(
					transparent ? "transparent-navbar" : "",
					float ? "float" : ""
				)}
				fixed="top"
			>
				<Link to="/" className="link-no-style" id={"site-navbar-brand"}>
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
					<Nav activeKey={path}>
						{navItems.map((item, i) =>
							item.dropdown ? (
								<NavDropdown
									id={"navDropdown-" + item.name}
									title={item.name}
									key={i}
									alignRight
								>
									{item.children.map((item, j) => (
										<NavbarLink key={j} page={item.path} dropdown>
											{item.name}
										</NavbarLink>
									))}
								</NavDropdown>
							) : (
								<NavbarLink key={i} page={item.path}>
									{item.name}
								</NavbarLink>
							)
						)}
						<AuthDropdown />
					</Nav>
				</BootstrapNavbar.Collapse>
			</BootstrapNavbar>
		</>
	);
};
export default Navbar;
