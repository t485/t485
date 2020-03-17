import * as firebase from "firebase/app";

function unexpectedFirebaseError(
	error: firebase.FirebaseError | firebase.auth.AuthError
): string {
	return (
		"An unknown error occurred. Please contact the webmaster. Include the following Reference Data: \n\n" +
		"<<SDV1:START>> " +
		encodeURIComponent(
			btoa(
				JSON.stringify({
					version: "1",
					error: error,
					date: new Date().getTime(),
				})
			)
		)
			.match(/.{1,15}/g)
			.join(" ") +
		" <<SDV1:END>>"
	);
}

export { unexpectedFirebaseError };
