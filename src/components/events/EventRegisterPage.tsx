import { RouteComponentProps } from "@reach/router";
import React, { ReactElement } from "react";
import EventLayout, { EventPageProps } from "./EventLayout";

export default function EventRegisterPage(
	props: Partial<EventPageProps>
): ReactElement {
	// because reach router types doesn't understand path slugs.
	const { year, event, location } = props as EventPageProps;

	return (
		<EventLayout
			page={"register"}
			event={event}
			location={location}
			year={year}
		>
			<h1>Register</h1>
		</EventLayout>
	);
}
