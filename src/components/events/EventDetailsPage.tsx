import { RouteComponentProps } from "@reach/router";
import React, { ReactElement } from "react";
import EventLayout, { EventPageProps } from "./EventLayout";

export default function EventDetailsPage(
	props: Partial<EventPageProps>
): ReactElement {
	// because reach router types doesn't understand path slugs.
	const { year, event, location } = props as EventPageProps;

	return (
		<EventLayout page={""} location={location} event={event} year={year}>
			<h1>Details</h1>
			<p>
				Rafting is a fun campout where we head out to the american river. On
				Saturday we will stay at the campsite and even play some fun games,
				while on sunday we will go rafting!
			</p>
			<p>
				This year, we will be having two options for scouts to choose between.
				The South fork is recommended for first timers. It has more rapids than
				the Middle fork, but they are easier. The middle fork is harder than the
				south fork, but has fewer rapids. Scouts must be age 12 to go on the
				middle fork.
			</p>
			<p>Feast your eyes on this picture of some people rafting.</p>
			<img
				className="img-fluid rounded"
				src="https://images.unsplash.com/photo-1503232478550-492d531afef9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2110&q=80"
				alt=""
			/>
		</EventLayout>
	);
}
