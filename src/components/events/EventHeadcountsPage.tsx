import { RouteComponentProps } from "@reach/router";
import React, { ReactElement } from "react";
import EventLayout, { EventPageProps } from "./EventLayout";

export default function EventHeadcountsPage(
	props: Partial<EventPageProps>
): ReactElement {
	// because reach router types doesn't understand path slugs.
	const { year, event, location } = props as EventPageProps;
	/**
	 *
	 * Allow FORMBUILDER
	 * some required fields, some optional
	 * - Full Name (from account)
	 * - Car info, etc
	 *
	 *
	 * OR
	 * Full fledged normal form
	 * plus they can add a few fields via json
	 * click button to add multiple choice
	 * e.g. South or North fork
	 * export as spreadsheet?
	 */
	return (
		<EventLayout
			page={"headcounts"}
			location={location}
			event={event}
			year={year}
		>
			<h1>Headcounts</h1>
		</EventLayout>
	);
}
