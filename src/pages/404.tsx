import React, { ReactElement } from "react";

import { Layout, SEO } from "../components/layout";

const NotFoundPage = (): ReactElement => (
	<Layout>
		<SEO title="404: Not found" />
		<h1>NOT FOUND</h1>
		<p>You just hit a route that does not exist... the sadness.</p>
	</Layout>
);

export default NotFoundPage;
