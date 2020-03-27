import React, { ReactElement } from "react";
import * as firebase from "firebase/app";

function unexpectedFirebaseError(
	error: firebase.FirebaseError | firebase.auth.AuthError,
	outputHTMLElement?: false
): string;
function unexpectedFirebaseError(
	error: firebase.FirebaseError | firebase.auth.AuthError,
	outputHTMLElement: true
): string | ReactElement;

function unexpectedFirebaseError(
	error: {
		message: string;
	},
	/**
	 * By default, this is set to `false` and it returns a string error message. Set it to true to return a element instead.
	 */
	outputHTMLElement = false
): string | ReactElement {
	console.log(error);
	if (outputHTMLElement) {
		return (
			<>
				<p>{error.message}</p>
				<p>
					If this is unexpected, reload the page and try again in a few minutes,
					or contact the webmaster.
				</p>
			</>
		);
	}
	return (
		error.message + " If this is unexpected, please contact the webmaster."
	);
	// "An unknown error occurred. Please contact the webmaster. Include the following Reference Data: \n\n" +
	// "<<SDV1:START>> " +
	// encodeURIComponent(
	// 	btoa(
	// 		JSON.stringify({
	// 			version: "1",
	// 			error: error,
	// 			date: new Date().getTime(),
	// 		})
	// 	)
	// )
	// 	.match(/.{1,15}/g)
	// 	.join(" ") +
	// " <<SDV1:END>>"
}

export { unexpectedFirebaseError };
