import React, { ReactElement } from "react";
import { Router, WindowLocation } from "@reach/router";
import NotFoundPage from "./404";
import EventListPage from "../components/events/EventListPage";
import EventDetailsPage from "../components/events/EventDetailsPage";
import EventAgendaPage from "../components/events/EventAgendaPage";
import EventRegisterPage from "../components/events/EventRegisterPage";
import EventResourcesPage from "../components/events/EventResourcesPage";
import EventPhotosPage from "../components/events/EventPhotosPage";
import EventHeadcountsPage from "../components/events/EventHeadcountsPage";
import { Layout } from "../components/layout";
import { Spinner } from "react-bootstrap";
import { useFirebase } from "../firebase";
import firebaseType from "firebase";

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

export interface EventData {
	name: string;
	start: firebaseType.firestore.Timestamp;
	end: firebaseType.firestore.Timestamp;
	location: string;
	SICs: string[];
	bannerPhoto: string;
}

export default function EventsPage(): ReactElement {
	const [loading, setLoading] = React.useState(true);
	const firebase = useFirebase();
	const [data, setData] = React.useState<EventData>();
	React.useEffect(() => {
		if (!firebase) return;

		setData({
			name: "Rafting",
			start: firebase.firestore.Timestamp.fromMillis(1591772400000),
			end: firebase.firestore.Timestamp.fromMillis(1591858800000),
			location: "American River",
			SICs: ["KeRay Chen", "Daniel Lin"],
			bannerPhoto:
				"https://images.unsplash.com/photo-1503232478550-492d531afef9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2110&q=80",
		});
		setLoading(false);
	}, [firebase]);
	//TODO: fetch firebase here?
	//  How should changes be dealt with? live, or not?
	// what about headcounts data
	return loading ? (
		<Layout empty>
			<div className={"text-center pt-5"}>
				<Spinner animation={"border"} />
			</div>
			<p className={"text-center pt-5"}>Loading...</p>
		</Layout>
	) : (
		<Router>
			<EventListPage path={"/events"} />
			<EventListPage path={"/events/:year"} />
			<EventDetailsPage data={data} path={"/events/:year/:event"} />
			<EventAgendaPage data={data} path={"/events/:year/:event/agenda"} />
			<EventResourcesPage data={data} path={"/events/:year/:event/resources"} />
			<EventPhotosPage data={data} path={"/events/:year/:event/photos"} />
			<EventHeadcountsPage
				data={data}
				path={"/events/:year/:event/headcounts"}
			/>
			<EventRegisterPage data={data} path={"/events/:year/:event/register"} />
			<NotFoundPageWrapper default />
		</Router>
	);
}
