import React, { ReactElement } from "react";
import firebase from "../../components/server/firebase";
import { Layout, SEO } from "../../components/layout";
import { FirebaseError } from "firebase";
import { unexpectedFirebaseError } from "../../utils/unexpectedError";
import useSessionStorage from "../../utils/useSessionStorage";
import { Link } from "gatsby";

interface RecoverEmailState {
	code: string;
}

export default function RecoverEmailPage({
	location,
}: {
	location: { state: RecoverEmailState };
}): ReactElement {
	const [cachedCode, setCachedCode] = useSessionStorage<string>(
		"cachedCode",
		""
	);
	const [restoredEmail, setRestoredEmail] = useSessionStorage<string>(
		"restoredEmail",
		""
	);
	// we can't combine success with restored email because there could be an error applying the action code.
	const [success, setSuccess] = useSessionStorage("success", false);
	const [error, setError] = useSessionStorage<null | {
		title: string;
		description: string;
	}>("error", null);
	if (location?.state && location.state?.code !== cachedCode) {
		// the code that we are caching is outdated, so we need to reset everything
		setRestoredEmail("");
		setSuccess(false);
		setError(null);
		setCachedCode(location.state?.code);
	}
	React.useEffect(() => {
		const actionCode = location?.state?.code;
		if (!actionCode) {
			setError({
				title: "Session Expired",
				description:
					"Your session has expired. Please click the original link in the email again.",
			});
			return;
		}
		setCachedCode(actionCode);
		firebase
			.auth()
			.checkActionCode(actionCode)
			.then(function(info) {
				// Get the restored email address.
				setRestoredEmail(info["data"]["email"]);

				// Revert to the old email.
				return firebase.auth().applyActionCode(actionCode);
			})
			.then(function() {
				// log the user out so their account settings will be fixed
				firebase
					.auth()
					.signOut()
					.catch(error => {
						console.log(
							error
						); /* do nothing, signing out isn't a necessary issue*/
					});
				// Account email reverted to restoredEmail
				setSuccess(true);
			})
			.catch((error: FirebaseError) => {
				// Invalid code.
				switch (error.code) {
					case "auth/expired-action-code":
						setError({
							title: "Link Expired",
							description:
								"This link is no longer valid. Please contact the webmaster.",
						});
						break;
					case "auth/invalid-action-code":
						setError({
							title: "Invalid Link",
							description:
								"This link is no longer valid because it is either expired, malformed, or has already been used.",
						});
						break;
					case "auth/user-disabled":
						setError({
							title: "Account Disabled",
							description:
								"We are unable to process this request because your account has been disabled. If you " +
								"think this is an error, please contact the webmaster.",
						});
						break;
					case "auth/user-not-found":
						setError({
							title: "Account Deleted",
							description:
								"We are unable to process this request because your account has been deleted. If you think" +
								"this is an error, please contact the webmaster.",
						});
						break;
					default:
						setError({
							title: "Error: " + error.code,
							description: unexpectedFirebaseError(error),
						});
				}
			});
	}, []);
	console.log(error);
	return (
		<Layout>
			<SEO title="404: Not found" />
			{success ? (
				<>
					<h1>Success!</h1>
					<p>
						We&apos;ve changed your email back to <b>{restoredEmail}</b>. If
						your account was compromised, please{" "}
						<Link to={"/account/login"}>Login</Link> and change your password,
						or <Link to={"/account/forgotpassword"}>reset your password</Link>{" "}
						if you you are no longer able to login.
					</p>
				</>
			) : error ? (
				<>
					<h1>Error: {error.title}</h1>
					{error.description}
				</>
			) : (
				<>
					<h1>Loading</h1>
					<p>
						We&apos;re processing your request. Please do not reload this page.
					</p>
				</>
			)}
		</Layout>
	);
}
