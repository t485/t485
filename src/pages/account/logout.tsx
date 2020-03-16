import React, { ReactElement } from "react";
import Layout from "../../components/layout/Layout";
import SEO from "../../components/layout/seo";
import firebase from "../../components/server/firebase";

const LogoutPage = (): ReactElement => {
	interface Error {
		exists: boolean;
		message?: string;
		code?: string;
	}

	const [error, setError]: [
		Error,
		React.Dispatch<React.SetStateAction<Error>>
	] = React.useState({
		exists: false,
	});
	const [loading, setLoading] = React.useState(true);
	React.useEffect(() => {
		firebase
			.auth()
			.signOut()
			.then(() => {
				setLoading(false);
			})
			.catch((e: Error) => {
				setError(e);
			});
	}, [firebase]);
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
