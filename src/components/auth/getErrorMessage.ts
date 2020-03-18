import { unexpectedFirebaseError } from "../../utils/unexpectedError";

export default function getErrorMessage(
	error: firebase.auth.AuthError
): {
	email?: string;
	password?: string;
} {
	switch (error.code) {
		case "auth/user-disabled":
			return {
				email:
					"Your account has been disabled. If you believe this is a mistake, please contact the webmaster.",
			};
		case "auth/wrong-password":
			return {
				password: "Incorrect Password! Please try again.",
			};
		case "auth/user-not-found":
		case "auth/invalid-email":
			// Sometimes, we don't want to reveal whether or not a user exists.
			// However, for our use case, it's more likely somebody will mistype the
			// email, so for this specific use case the added convenience outweighs
			// the slight privacy loss.
			return {
				email: "No user exists with that email.",
			};
		default:
			// This goes under password because that is the most likely field to exist.
			console.log(error);
			return {
				password: unexpectedFirebaseError(error),
			};
	}
}
