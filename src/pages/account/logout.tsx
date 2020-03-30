import React, { ReactElement } from "react";
import Layout from "../../components/layout/Layout";
import SEO from "../../components/layout/seo";
import { firebase, useFirebaseInitializer } from "../../firebase";

const LogoutPage = (): ReactElement => {
	const firebaseReady = useFirebaseInitializer();
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
		if (!firebaseReady) return;
		firebase
			.auth()
			.signOut()
			.then(() => {
				setLoading(false);
			})
			.catch((e: Error) => {
				setError(e);
			});
	}, [firebaseReady]);
	return (
		<Layout>
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
