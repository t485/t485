import React, { ReactElement } from "react";
import { Layout, SEO } from "../../../components/layout";
import { WindowLocation } from "@reach/router";
import { useFirebase } from "../../../firebase";
import AuthGate from "../../../components/gates/AuthGate";
import { LinkData } from "./index";
import firebaseType from "firebase";
import moment from "moment";
import Chart from "../../../components/linkanalytics/ClicksPerDayChart";
import { LoadingGate } from "../../../components/gates";
import NotFoundPage from "../../404";

type Snapshot<T> = firebaseType.firestore.DocumentSnapshot<T>;

interface PageProps {
	location: WindowLocation;
}

const Download = ({
	name,
	content,
	children,
}: {
	name: string;
	content: string;
	children: any;
}): React.ReactElement => {
	const ref = React.useRef(null);

	return (
		<>
			<a onClick={(): void => ref.current.click()}>{children}</a>
			<a download={name} href={content} ref={ref} />
		</>
	);
};

export default function LinkAnalyticsPage({
	location,
}: PageProps): ReactElement {
	const path = /\/resources\/links\/analytics\/(.+)/.exec(location.pathname);
	const id =
		path && path[1]
			? path[1]
			: location.hash.length > 0
			? location.hash.substring(1)
			: "";
	const firebase = useFirebase();
	const [data, setData] = React.useState<null | LinkData>(null);
	const [hideClicks, setHideClicks] = React.useState(true);
	const [show404, setShow404] = React.useState(false);
	React.useEffect(() => {
		if (!firebase || !id) return;
		const unsubscribe = firebase
			.firestore()
			.collection("linkshortener")
			.doc(id)
			.onSnapshot((snapshot: Snapshot<LinkData>) => {
				const data = snapshot.data();
				setShow404(!data);

				setData(data);
				console.log("data");
			});

		return unsubscribe;
	}, [firebase, id]);
	console.log(location);
	return show404 ? (
		<NotFoundPage location={location} />
	) : (
		<Layout location={location}>
			<SEO title="Link Analytics" />
			<AuthGate pagePath={"/links/analytics"}>
				<LoadingGate loading={!data} loadingText={"Fetching Data..."}>
					<h1>Link Analytics: link.t485.org/{id}</h1>
					{!data?.clickAnalytics ? (
						<p>Analytics have not been turned on for this link.</p>
					) : !data?.clicks || data?.clicks.length === 0 ? (
						<p>
							Analytics will be available once somebody uses the short link!
						</p>
					) : (
						<>
							<p>
								<b>Destination:</b>{" "}
								{data === null ? (
									<i>Loading...</i>
								) : data.disablePreview ? (
									<i>
										Unavailable because previews have been disabled (
										<a
											href={"https://link.t485.org/" + id}
											target={"_blank"}
											rel={"noopener noreferrer"}
										>
											visit
										</a>
										)
									</i>
								) : (
									<a
										href={data?.to}
										target={"_blank"}
										rel={"noopener noreferrer"}
									>
										{data?.to}
									</a>
								)}
							</p>
							<hr />
							<h4>Clicks per Day</h4>
							<Chart clicks={data?.clicks} />
							<h4 className={"mt-3"}>
								All Clicks: {data?.clicks?.length} (
								<a onClick={(): void => setHideClicks(old => !old)}>
									{hideClicks ? "Show" : "Hide"}
								</a>
								)
							</h4>
							{!hideClicks && (
								<ul>
									{data?.clicks?.map((click, i) => (
										<li key={i}>
											{moment(click).format("M/D/YY [at] h:mm:ss A")}
										</li>
									))}
								</ul>
							)}
							<p>
								Raw click data (with each value representing the time of one
								click) is also avaliable{" "}
								<Download
									name={`t485ls-rawdata-${id}`}
									content={`data:text/csv;charset=utf-8,${data?.clicks
										.map(click =>
											moment(click).format("YYYY-MM-DD HH:mm:ss.SSS")
										)
										.join(",")}`}
								>
									as CSV
								</Download>
								,{" "}
								<Download
									name={`t485ls-rawdata-${id}`}
									content={`data:application/json;charset=utf-8,[${data?.clicks
										.map(click => '"' + new Date(click).toISOString() + '"')
										.join(", ")}]`}
								>
									as JSON
								</Download>
								, or{" "}
								<Download
									name={`t485ls-rawdata-${id}`}
									content={`data:text/plain;charset=utf-8,${data?.clicks
										.map(click =>
											moment(click).format("MM/DD/YYYY [at] hh:mm:ss A")
										)
										.join("\n")}`}
								>
									as formatted text
								</Download>
								. CSV data is provided in an excel-recognizable date time
								format. JSON is provided as an array of ISO 8601 strings.
							</p>
							<p>
								All times are adjusted for your timezone:{" "}
								<i>{/\((.+)\)/.exec(new Date().toString())[1]}</i>
							</p>
						</>
					)}
				</LoadingGate>
			</AuthGate>
		</Layout>
	);
}
