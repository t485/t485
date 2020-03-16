import React, { ReactElement } from "react";
import getParameterByName from "getparameterbyname";
import { Layout, SEO } from "../../components/layout";
import { navigate } from "gatsby";

const ActionPage = (): ReactElement => {
	const [error, setError] = React.useState(false);
	React.useEffect(() => {
		// TODO: Implement getParameterByName()
		const url = window.location.href;
		// Get the action to complete.
		const mode = getParameterByName("mode", url);
		// Get the one-time code from the query parameter.
		const actionCode = getParameterByName("oobCode", url);
		// (Optional) Get the continue URL from the query parameter if available.
		const continueUrl = getParameterByName("continueUrl", url);

		// Configure the Firebase SDK.
		// This is the minimum configuration required for the API to be used.

		// Handle the user management action.
		switch (mode) {
			case "resetPassword":
				// Display reset password handler and UI.
				// handleResetPassword(actionCode, continueUrl, lang);
				navigate("/account/handlepasswordreset", {
					state: {
						code: actionCode,
						return: continueUrl,
					},
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
						return: continueUrl,
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
						The link you followed to access this page is invalid. If
						you believe this is a mistake, please contact the
						webmaster.
					</p>
				</>
			)}
		</Layout>
	);
};

export default ActionPage;
