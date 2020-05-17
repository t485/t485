import React, { ReactElement } from "react";
import { Layout, SEO } from "../components/layout";
import Loadable from "react-loadable";

export default function CalendarPage(): ReactElement {
	/**
	 * TODO
	 * When you click an event, it shows details in the tab
	 * If it is an event, the details contains a link to the event page
	 *
	 * On mobile, default view should be list
	 *
	 * Other views?
	 */

	const LoadableCalendar = Loadable({
		loader: () => import("../components/calendar/EventsCalendar"),
		loading() {
			return <div>Loading...</div>;
		},
	});
	return (
		<Layout>
			<SEO title="Calendar" />
			<h1>Troop 485 Calendar</h1>
			<LoadableCalendar />
		</Layout>
	);
}
