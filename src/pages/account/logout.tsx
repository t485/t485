import React, { ReactElement } from "react";
import Layout from "../../components/layout/Layout";
import SEO from "../../components/layout/seo";
import { useFirebase } from "../../firebase";
import { WindowLocation } from "@reach/router";

const LogoutPage = ({
	location,
}: {
	location: WindowLocation;
}): ReactElement => {
	const firebase = useFirebase();

	interface Error {
		exists: boolean;
		message?: string;
		code?: string;
	}

	const [error, setError] = React.useState<Error>({
		exists: false,
	});
	const [loading, setLoading] = React.useState(true);
	React.useEffect(() => {
		if (!firebase) return;
		console.log("BEFORE");
		firebase
			.auth()
			.signOut()
			.then(() => {
				console.log("AFTER");
				setLoading(false);
			})
			.catch((e: Error) => {
				setError(e);
			});
	}, [firebase]);
	return (
		<Layout location={location}>
			<SEO title="Login" />
			<h1>Logout</h1>
			<p>
				{loading
					? "Logging you out. Please wait..."
					: error.exists
					? error.message
					: "You have been logged out successfully"}
			</p>
		</Layout>
	);
};

export default LogoutPage;
