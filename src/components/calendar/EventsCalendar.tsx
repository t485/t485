import React, { ReactElement } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import googleCalendarPlugin from "@fullcalendar/google-calendar";
import listPlugin from "@fullcalendar/list";
import bootstrapPlugin from "@fullcalendar/bootstrap";
import timeGridPlugin from "@fullcalendar/timegrid";
import "@fullcalendar/core/main.css";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/list/main.css";
import "@fullcalendar/bootstrap/main.css";
import "@fullcalendar/timegrid/main.css";
import { Button, Col, Modal, Row } from "react-bootstrap";
import AuthContext from "../../context/AuthContext";
import { Link } from "gatsby";
import moment from "moment";

export default function EventsCalendar(): ReactElement {
	// false to hide, data to show
	const [showEventModal, setShowEventModal] = React.useState(false);
	const [eventModal, setEventModal] = React.useState<{
		title: string;
		link: string;
		description?: string;
		location?: string;
		time?: string;
		eventPage?: string;
	}>({
		title: "Error Displaying Event",
		link: "#",
	});
	const { user, loading } = React.useContext(AuthContext);
	const handleCloseEventModal = (): void => setShowEventModal(false);

	const calendarPlugins = [
		dayGridPlugin,
		googleCalendarPlugin,
		listPlugin,
		bootstrapPlugin,
		timeGridPlugin,
	];

	return (
		<>
			<div
				className={"calendar-wrapper"}
				style={{
					height: "70vh",
				}}
			>
				<FullCalendar
					header={{
						left: "prev,next today",
						center: "title",
						right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
					}}
					height={"parent"}
					defaultView="dayGridMonth"
					themeSystem={"standard"}
					plugins={calendarPlugins}
					googleCalendarApiKey={"AIzaSyDjnr0xVQlYzYYJL-pyccDZuFuHQouLetQ"}
					events={{
						googleCalendarId: "bsa485@gmail.com",
						className: "gcal-event", // an option!
					}}
					eventClick={({ event, jsEvent }): void => {
						jsEvent.preventDefault();
						console.log(event, event.title, event.url);
						const eventPage: any = undefined;
						// TODO: integrate with event pages
						// if (event.url === "https://www.google.com/calendar/event?eid=ZzdhbzNhYWFlcHY0bWhjOTR2c3R1aTBjbXMgYnNhNDg1QG0") {
						// 	eventPage = "/events/2020/rafting";
						// }
						let time = "";
						if (event.start) {
							const start = moment(event.start);
							time += start.format("MMMM Do YYYY, h:mm a");
						}
						if (event.start && event.end) {
							time += " to ";
						}
						if (event.end) {
							const end = moment(event.end);
							const singleDayEvent =
								moment(event.start).format("MMMM Do YYYY") ===
								moment(event.end).format("MMMM Do YYYY");
							time += end.format(
								singleDayEvent ? "h:mm a" : "MMMM Do YYYY, h:mm a"
							);
						}
						setEventModal({
							title: event.title,
							link: event.url,
							description: event.extendedProps.description,
							location: event.extendedProps.location,
							eventPage: eventPage,
							time: time,
						});

						setShowEventModal(true);
					}}
					// bootstrapFontAwesome={{
					// 	close: 'fa-times',
					// 	prev: 'fc-icon fc-icon-chevron-left',
					// 	next: 'fc-icon fc-icon-chevron-right',
					// 	prevYear: 'fa-angle-double-left',
					// 	nextYear: 'fa-angle-double-right'
					// }}
				/>
			</div>
			<Row>
				<Col sm={6}>
					{/*<Link to={"/events"}*/}
					{/*   rel={"noopener noreferrer"} className={"link-no-style"}>*/}
					<Button
						block
						variant={"primary"}
						className={"mt-3"}
						as={Link}
						to={"/events"}
					>
						View All Event Pages {(loading || !user) && " (login required)"}
					</Button>
					{/*</Link>*/}
				</Col>
				<Col sm={6}>
					<a
						href={
							"https://calendar.google.com/calendar?cid=YnNhNDg1QGdtYWlsLmNvbQ"
						}
						target={"_blank"}
						rel={"noopener noreferrer"}
						className={"link-no-style"}
					>
						<Button block variant={"primary"} className={"mt-3"}>
							Add to Google Calendar
						</Button>
					</a>
				</Col>
			</Row>
			<Modal show={showEventModal} onHide={handleCloseEventModal}>
				<Modal.Header closeButton>
					<Modal.Title>{eventModal.title}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{eventModal.description
						?.split("\n")
						.map((string, i) => [string, <br key={i} />])
						.flat()}
					{eventModal.description === undefined && (
						<>
							<p>
								<i>No Description Available</i>
							</p>
						</>
					)}
					<br />
					{eventModal.time !== "" && (
						<p>
							<b>When: </b> <span>{eventModal.time}</span>
						</p>
					)}
					{eventModal.location && (
						<p>
							<b>Where: </b> <span>{eventModal.location}</span>
						</p>
					)}
				</Modal.Body>
				<Modal.Footer>
					{eventModal.eventPage && user && (
						<Link className={"link-no-style mr-auto"} to={eventModal.eventPage}>
							<Button variant={"primary"}>Open Event Page</Button>
						</Link>
					)}
					<a
						target={"_blank"}
						rel={"noopener noreferrer"}
						href={eventModal.link}
					>
						<Button variant="secondary">Open in Google Calendar</Button>
					</a>
					<Button variant="danger" onClick={handleCloseEventModal}>
						Close
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
}
