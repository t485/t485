import React, { ReactElement } from "react";
import { Layout, SEO } from "../../components/layout";

export default function AboutPage(): ReactElement {
	return (
		<Layout>
			<SEO title="The Patrol Leaders' Council" />
			<h1>The Patrol Leaders&rsquo; Council</h1>
			<h3 className={"mt-3"}>What is the Patrol Leaders&rsquo; Council?</h3>
			<p>
				The PLC, or Patrol Leaders&rsquo; Council, is a group of senior scouts
				consisting of everybody who either has a troop job or is first class and
				above. You may have heard scouts say &ldquo;Come to PLC&rdquo; or
				&ldquo;PLC in the corner&rdquo;. That&lsquo;s because the term
				&ldquo;PLC&rdquo; is commonly used to refer to meetings of the PLC. The
				PLC has a major meeting once a month (on the 4th Monday), as well as
				minor meetings after each troop meeting.
			</p>
			<p>
				Meetings of the PLC are led by the Senior Patrol Leader, and are also
				typically attended by the scoutmaster, who may provide some oversight
				and advice, although most of that work is done by the members of the PLC
				themselves. Additionally, at major PLC meetings, the PLC goes over the
				status of troop events and plans troop meetings for the next month. At
				each minor PLC, the PLC reviews and reflects on the troop meeting right
				before it. Additionally, at each meeting, the PLC reviews overall status
				of the troop, as well as the status of each patrol.
			</p>
			<h3>What is PLC approval?</h3>
			<p>
				The PLC is in charge of overseeing all troop-affiliated events. This
				includes patrol activities, such as outings or campouts. Thus, before
				having a patrol event, patrol leaders need to obtain PLC approval. To do
				this, they will bring up their event during the patrol review section of
				any PLC meeting. They&rsquo;ll briefly talk about their plans for the
				event, and members of the PLC may comment with advice about the event.
				Then, the SPL will ask if anybody has any concerns with the event, and
				if nobody has any concerns, or if all concerns are resolved, then the
				SPL will grant PLC Approval. The process is very quick and nothing to be
				worried about. PLC approval required for all patrol events except
				transition parties and patrol camp, which are implicitly approved
				because they are put on the troop&rsquo;s schedule of events.
			</p>
		</Layout>
	);
}
