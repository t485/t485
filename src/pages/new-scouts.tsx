import React, { ReactElement } from "react";
import { Layout, SEO } from "../components/layout";
import { WindowLocation } from "@reach/router";

export default function NewScoutPage({
	location,
}: {
	location: WindowLocation;
}): ReactElement {
	// TODO: maybe use this for this or some other page? https://startbootstrap.com/templates/business-frontpage/
	return (
		<Layout location={location}>
			<SEO title={"New Scouts"} />
			<h1>New Scouts</h1>
		</Layout>
	);
}
