import React, { ReactElement } from "react";

import { Layout, SEO } from "../components/layout";

const NotFoundPage = (): ReactElement => (
	<Layout>
		<SEO title="404: Not found" />
		<h1>404: Resource not found</h1>
		<p>
			No file currently exists at this location. It may have been deleted,
			renamed, or moved.
		</p>
	</Layout>
);

export default NotFoundPage;
