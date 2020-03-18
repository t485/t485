import React, { ReactElement } from "react";
import { Layout, SEO } from "../../components/layout";
import { navigate } from "gatsby";
import { ForgotPasswordState } from "./forgotpassword";
import { PasswordResetState } from "./handlepasswordreset";

function getParameterByName(
	name: string,
	url?: string
): string | null | undefined {
	if (!url) url = window.location.href;
	name = name.replace(/[[\]]/g, "\\$&");
	const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
	const results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return "";
	return decodeURIComponent(results[2].replace(/\+/g, " "));
}

const ActionPage = (): ReactElement => {
	const [error, setError] = React.useState(false);
	React.useEffect(() => {
		const url = window.location.href;
		// Get the action to complete.
		const mode = getParameterByName("mode", url);
		// Get the one-time code from the query parameter.
		const actionCode = getParameterByName("oobCode", url);
		// (Optional) Get the continue URL from the query parameter if available.
		// continueUrl is a url that contains a query string named state with the state.
		const continueData: ForgotPasswordState = JSON.parse(
			getParameterByName("state", getParameterByName("continueUrl", url))
		);

		// Handle the user management action.
		switch (mode) {
			case "resetPassword":
				// Display reset password handler and UI.
				// handleResetPassword(actionCode, continueUrl, lang);
				navigate("/account/handlepasswordreset", {
					state: {
						code: actionCode,
						email: continueData.email,
						continueState: continueData.continueState,
					} as PasswordResetState,
					replace: true,
				});
				break;
			case "recoverEmail":
				// Display email recovery handler and UI.
				// handleRecoverEmail(actionCode, lang);
				navigate("/account/handleemailrecovery", {
					state: {
						code: actionCode,
					},
					replace: true,
				});
				break;
			case "verifyEmail":
				// Display email verification handler and UI.
				// handleVerifyEmail(actionCode, continueUrl, lang);
				navigate("/account/handleemailverification", {
					state: {
						code: actionCode,
						return: continueData,
					},
					replace: true,
				});
				break;
			default:
				setError(true);
			// Error: invalid mode.
		}
	}, []);
	return (
		<Layout>
			<SEO title="Account Action" />
			{!error ? (
				<h1>Please wait while we process your request</h1>
			) : (
				<>
					<h1>Error: Invalid Link</h1>
					<p>
						The link you followed to access this page is invalid. If you believe
						this is a mistake, please contact the webmaster.
					</p>
				</>
			)}
		</Layout>
	);
};

export default ActionPage;
