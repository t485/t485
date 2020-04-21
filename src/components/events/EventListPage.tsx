import { RouteComponentProps } from "@reach/router";
import React, { ReactElement } from "react";
import { Link, navigate } from "gatsby";
import { Layout, SEO } from "../layout";

interface EventsListProps extends RouteComponentProps {
	year?: string;
}

export default function EventsList(props: EventsListProps): ReactElement {
	if (props.year) {
		navigate("/events/?filteryear=" + props.year);
	}
	return (
		<Layout location={props.location}>
			<SEO title={"Events"} />
			<h1>Events List</h1>
			<ul>
				<li>
					<Link to={"/events/2020/rafting"}>Rafting 2020</Link>
				</li>
			</ul>
		</Layout>
	);
}
