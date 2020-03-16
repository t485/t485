import React, { ReactElement } from "react";

import Layout from "../components/layout/Layout";
import SEO from "../components/layout/seo";

const NotFoundPage = (): ReactElement => (
	<Layout>
		<SEO title="404: Not found" />
		<h1>NOT FOUND</h1>
		<p>You just hit a route that does not exist... the sadness.</p>
	</Layout>
);

export default NotFoundPage;
