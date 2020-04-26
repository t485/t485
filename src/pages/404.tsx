import React, { ReactElement } from "react";
import { Layout, SEO } from "../components/layout";
import { WindowLocation } from "@reach/router";
import { navigate } from "gatsby";
import { AuthContinueState } from "../components/auth";
import { useFirebase } from "../firebase";
import AuthContext from "../context/AuthContext";

interface PageProps {
	location: WindowLocation;
}

export default function NotFoundPage({ location }: PageProps): ReactElement {
	// const {user, loading, error} = React.useContext(AuthContext);
	// const firebase = useFirebase();
	// if (!loading && !user) {
	// 	navigate("/account/login", {
	// 		state: {
	// 			from: "/404",
	// 			message: true,
	// 			return: true,
	// 		} as AuthContinueState,
	// 	});
	// }

	return (
		<Layout location={location}>
			<SEO title="404: Not found" />
			<h1>404: Resource not found</h1>
			<p>
				No file currently exists at this location. It may have been deleted,
				renamed, or moved.
			</p>
		</Layout>
	);
}
