import { FirebaseError } from "firebase";

function unexpectedFirebaseError(error: FirebaseError): string {
	return (
		"An unknown error occurred. Please contact the webmaster. Include the following Reference Data: \n\n" +
		"<<SDV1:START>> " +
		encodeURIComponent(
			btoa(
				JSON.stringify({
					version: "1",
					code: error.code,
					message: error.message,
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
