import React, { ReactElement } from "react";
import { Layout, SEO } from "../components/layout";

export default function NewScoutPage(): ReactElement {
	// TODO: maybe use this for this or some other page? https://startbootstrap.com/templates/business-frontpage/
	return (
		<Layout>
			<SEO title={"New Scouts"} />
			<h1>New Scouts</h1>
		</Layout>
	);
}
