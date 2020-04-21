import React, { ReactElement } from "react";
import { Router } from "@reach/router";
import NotFoundPage from "./404";
import EventListPage from "../components/events/EventListPage";
import EventDetailsPage from "../components/events/EventDetailsPage";
import EventAgendaPage from "../components/events/EventAgendaPage";
import EventRegisterPage from "../components/events/EventRegisterPage";
import EventResourcesPage from "../components/events/EventResourcesPage";
import EventPhotosPage from "../components/events/EventPhotosPage";
import EventHeadcountsPage from "../components/events/EventHeadcountsPage";

/*
NOTES:

path /events
render list of events

path /events/2019
redirect to /events?filter={year:2019} (can change format)

path /events/2019/labor-day-backpacking (enforce dash) (get the year from the date of the event, which they have to enter.

RESOURCES
https://www.qed42.com/blog/dynamic-routing-gatsby


PAGES
- Details
Normal stuff, any  updates

- Agenda
Not under resources because most people want to see it.

- Resources
Files, Etc.

- Photos
Photos from Google Photos

- Headcounts
See who is signed up

- Register
so you can sign up

OTHER STUFF
- need slack link somewhere
- headcounts/register is good or bad?

 */

// wrapper because reach router types are bad.
const NotFoundPageWrapper = (props: any): ReactElement => {
	return <NotFoundPage {...props} />;
};

export default function EventsPage(): ReactElement {
	return (
		<Router>
			<EventListPage path={"/events"} />
			<EventListPage path={"/events/:year"} />
			<EventDetailsPage path={"/events/:year/:event"} />
			<EventAgendaPage path={"/events/:year/:event/agenda"} />
			<EventResourcesPage path={"/events/:year/:event/resources"} />
			<EventPhotosPage path={"/events/:year/:event/photos"} />
			<EventHeadcountsPage path={"/events/:year/:event/headcounts"} />
			<EventRegisterPage path={"/events/:year/:event/register"} />
			<NotFoundPageWrapper default />
		</Router>
	);
}
