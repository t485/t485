import React, { ReactElement, useContext, useState } from "react";
import { Layout, SEO } from "../../components/layout";
import { useFirebase } from "../../firebase";
import useAuthState from "../../components/auth/useAuthState";
import AuthContext from "../../context/AuthContext";

export default function AboutPage(): ReactElement {
	const firebase = useFirebase();
	const { user } = useContext(AuthContext);
	const [spreadsheetKey, setSpreadsheetKey] = useState("");

	React.useEffect(() => {
		if (!firebase || !user) return;

		firebase
			.firestore()
			.collection("keys")
			.doc("spreadsheetIds")
			.get()
			.then(data => {
				const spreadsheetKey = data.data().troopJobs;
				setSpreadsheetKey(spreadsheetKey);
			});
	}, [user, firebase]);

	return (
		<Layout>
			<SEO title="The Patrol Leaders' Council" />
			<h1>Troop Jobs</h1>
			<h3 className={"mt-3"}>What are Troop Jobs?</h3>
			<p>
				A large troop such as Troop 485 has a lot of moving parts. There are
				many things that need to be done. Troop jobs are positions of
				responsibility within the troop for scouts. Each troop job is
				responsible for one piece of the troop. For example, the historian is in
				charge of documenting and organizing the history and memories of the
				troop, by collecting reflections and photos. The webmaster is in charge
				of the troop&apos;s website (that&rsquo;s this website!), and other
				troop technology. The Senior Patrol Leader is in charge of leading the
				troop and managing all troop jobs with the help of their Assistant SPLs.
			</p>

			<h3>How do I get a troop job?</h3>
			<p>
				Holders of troop jobs hold their job for one term. During each new term,
				troop jobs are reassigned to give other scouts opportunities to
				experience troop jobs, and to give troop job holders opportunities to
				explore other troop jobs (although there&apos;s nothing that a scout
				can&apos;t have a troop job for more than one term; they just have to
				reapply each term). The SPL is responsible for managing all troop jobs,
				and they typically have troop job applications at the start of each
				term.
			</p>

			<div
				style={{
					display: "block",
					width: "100%",
				}}
			>
				<h3>Current Troop Job Holders</h3>
				<p>If you&apos;d like an open position, contact the current SPL.</p>
				{user &&
					(spreadsheetKey ? (
						<iframe
							style={{
								width: "100%",
								border: "1px solid #555",
								height: "80vh",
							}}
							src={`https://docs.google.com/spreadsheets/d/${spreadsheetKey}/pubhtml?widget=true`}
						/>
					) : (
						<p>Loading troop jobs spreadsheet...</p>
					))}
				{!user && <p>To view the current troop job holders, log in.</p>}
			</div>
		</Layout>
	);
}
