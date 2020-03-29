import React, { ReactElement } from "react";
import { Layout, SEO } from "../components/layout";

export default function NewScoutPage(): ReactElement {
	return (
		<Layout>
			<SEO title={"New Scouts"} />
			<h1>New Scouts</h1>
		</Layout>
	);
}
