import React, { ReactElement } from "react";
import { Layout, SEO } from "../layout";
import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { Link } from "gatsby";
import classNames from "classnames";
import { RouteComponentProps, WindowLocation } from "@reach/router";
import "../../styles/events.scss";

export interface EventPageProps extends RouteComponentProps {
	year: string;
	event: string;
}

export default function EventLayout({
	page,
	year,
	location,
	children,
	event,
	noContainer,
}: {
	page: string;
	year: string;
	event: string;
	location: WindowLocation;
	children: React.ReactNode;
	noContainer?: boolean;
}): ReactElement {
	const [sticky, setSticky] = React.useState(false);
	const [navTop, setNavTop] = React.useState<undefined | number>(undefined);
	const headerNavRef = React.useRef(null);
	React.useEffect(() => {
		const resizeHandler = (): void => {
			// use the height and not the bottom because the navbar is position float, thus it wont get calculated as part of the height.
			const newNavTop = headerNavRef?.current?.getBoundingClientRect().height;
			setNavTop(newNavTop);
		};
		resizeHandler(); // initialize once
		window.addEventListener("resize", resizeHandler);
		return (): void => {
			window.removeEventListener("resize", resizeHandler);
		};
	}, []);
	React.useEffect(() => {
		const scrollHandler = (): void => {
			if (window.scrollY > (navTop || Infinity)) {
				setSticky(true);
			} else {
				setSticky(false);
			}
		};

		window.addEventListener("scroll", scrollHandler);
		return (): void => {
			window.removeEventListener("scroll", scrollHandler);
		};
	}, [navTop]);
	console.log(`/events/${year}/${page}/${event}/${page}`);
	const Seperator = (): ReactElement => <> &nbsp;&nbsp;&#8226;&nbsp;&nbsp; </>;
	return (
		<Layout empty location={location}>
			<SEO title={event + " " + year} />
			<div
				style={{
					background:
						"linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ),  url('https://images.unsplash.com/photo-1503232478550-492d531afef9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2110&q=80') center",
				}}
				className={"parallax-header"}
			>
				<div
					style={{
						paddingTop: "50px",
						paddingLeft: "75px",
						paddingRight: "25px",
						minHeight: "20vh",
						color: "white",
					}}
					ref={headerNavRef}
				>
					<h1>Rafting</h1>
					<p className="lead">
						June 10, 2020 - June 11, 2020 <Seperator /> American River{" "}
						<Seperator /> SIC: KeRay Chen, Daniel Lin
					</p>
				</div>
			</div>

			<Navbar
				bg="light"
				expand="sm"
				className={sticky ? "float attached" : ""}
				// 		style={sticky ? {
				// 	position: "fixed",
				// 	top: "56px",
				// 	zIndex: 1025,
				// 	width: "100vw",
				// 	boxShadow: "0 2px 5px 0 rgba(0, 0, 0, 0.3)",
				// } : undefined}
			>
				{/* Show the navbar brand if either sticky is on OR it's a moible device*/}
				{sticky && (
					<Navbar.Brand href="#home" className={"d-none d-md-block"}>
						Rafting 2020
					</Navbar.Brand>
				)}
				<Navbar.Brand href="#home" className={"d-block d-md-none"}>
					Rafting 2020
				</Navbar.Brand>
				<Navbar.Toggle aria-controls="basic-navbar-nav ml-auto" />
				<Navbar.Collapse id="basic-navbar-nav">
					<Nav
						className={sticky ? "mx-auto" : "ml-5 mr-auto"}
						activeKey={`/events/${year}/${event}/${page}`}
					>
						<Nav.Link
							eventKey={`/events/${year}/${event}/`}
							as={Link}
							to={`/events/${year}/${event}`}
						>
							Details
						</Nav.Link>
						{["Agenda", "Resources", "Photos", "Headcounts"].map((name, i) => (
							<Nav.Link
								key={i}
								eventKey={`/events/${year}/${event}/${name.toLowerCase()}`}
								as={Link}
								to={`/events/${year}/${event}/${name.toLowerCase()}`}
							>
								{name}
							</Nav.Link>
						))}
					</Nav>
					<Link
						className={"link-no-style"}
						to={`/events/${year}/${event}/register`}
					>
						<Button
							variant="primary"
							className={classNames(sticky ? "" : "mr-5")}
							style={{
								width: "15vw",
							}}
						>
							Register
						</Button>
					</Link>
				</Navbar.Collapse>
			</Navbar>
			{/*	This element makes the scroll natrual (so when the navbar becomes fixed the content below it doesn't hop up since nothing blocks it anymore. */}
			{sticky && (
				<div
					style={{
						height: "56px",
						width: "100vw",
						backgroundColor: "white",
					}}
				/>
			)}
			{noContainer ? (
				children
			) : (
				<Container className={"my-5"}>{children}</Container>
			)}
		</Layout>
	);
}
