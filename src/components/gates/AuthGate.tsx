import LoadingGate from "./LoadingGate";
import React from "react";
import AuthContext from "../../context/AuthContext";
import { Link, navigate } from "gatsby";
import { Button } from "react-bootstrap";
import { AuthContinueState } from "../auth";
import { WindowLocation } from "@reach/router";

export default function AuthGate({
	location,
	children,
	pagePath,
}: {
	children: any;
	pagePath?: string;
	location?: WindowLocation;
}): React.ReactElement {
	const { user, admin, loading, setupComplete } = React.useContext(AuthContext);
	const [redirecting, setRedirecting] = React.useState(false);
	if (!loading && !user) {
		setRedirecting(true);
		navigate("/account/login", {
			state: {
				from: pagePath || location?.pathname,
				message: true,
				return: true,
			} as AuthContinueState,
		});
	}
	return (
		<LoadingGate
			loading={loading || redirecting}
			loadingText={
				redirecting ? "Redirecting to login..." : "Authenticating..."
			}
		>
			{user ? (
				setupComplete ? (
					children
				) : (
					<>
						<h1>Setup Your Account to Continue</h1>
						<p>
							In order to view this page, you must finish setting up your
							account.
						</p>
						<Link to={"/account/setup"}>
							<Button block variant={"primary"}>
								Setup Your Account
							</Button>
						</Link>
					</>
				)
			) : (
				<>
					<p>Loading...</p>
				</>
			)}
		</LoadingGate>
	);
}
