import React, { ReactElement } from "react";
import EventLayout, { EventPageProps } from "./EventLayout";
import { Button } from "react-bootstrap";

/**
 * TWO OPTIONS
 * embed google doc
 * pure HTML
 */
export default function EventAgendaPage(
	props: Partial<EventPageProps>
): ReactElement {
	// because reach router types doesn't understand path slugs.
	const { year, event, location, data } = props as EventPageProps;

	return (
		<EventLayout
			page={"agenda"}
			location={location}
			event={event}
			year={year}
			data={data}
		>
			<Button
				onClick={(): void => {
					navigator.clipboard
						.readText()
						.then(text => {
							console.log("Pasted content: ", text);
						})
						.catch(err => {
							console.error("Failed to read clipboard contents: ", err);
						});
				}}
			>
				Click Me
			</Button>
			<h1>Agenda</h1>
			Saturday June 10th
			<ul>
				<li>12:00PM - Arrive at HOC5</li>
				<li>12:30PM - Leave HOC5</li>
				<li>3:30PM - Arrive at Campsite</li>
				<li>3:45PM - Set Up Tents</li>
				<li>4:00PM - Activity/Game (chaos tag)</li>
				<li>5:00PM - Free Time</li>
				<li>6:30PM - Dinner</li>
				<li>8:30PM - Campfire</li>
				<li>10:00PM - Lights Out</li>
			</ul>
			Sunday June 11th
			<ul>
				<li>5:30AM - Wake Up/Start Cooking</li>
				<li>6:30AM - Pack Up</li>
				<li>7:00AM - Middle Fork Participants Leave/Cleanup</li>
				<li>7:30AM - Camp Sweep</li>
				<li>8:30AM - South Fork Participants leave</li>
				<li>5:30PM - Everyone Arrives Back at Campsite</li>
				<li>6:00PM - Roses and Thorns</li>
				<li>6:15PM - Start driving back to HOC5</li>
				<li>9:45PM - Arrive back at HOC5</li>
			</ul>
			The Campsite must be completely clean/empty before the south fork
			participants leave at 8:30.
		</EventLayout>
	);
}
