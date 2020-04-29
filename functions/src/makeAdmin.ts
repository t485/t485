import * as firebaseFunctions from "firebase-functions";
import firebaseAdmin from "./firebaseAdmin";

export const makeAdmin = firebaseFunctions.https.onCall(
	// UID: id of user to make admin
	async ({ uid }: { uid: string }, context) => {
		if (!context.auth) {
			// Throwing an HttpsError so that the client gets the error details.
			throw new firebaseFunctions.https.HttpsError(
				"failed-precondition",
				"This function must be called by a current authenticated administrator."
			);
		}
		const callerRecord = await firebaseAdmin.auth().getUser(uid);
		// they need to either be an admin in the database OR have their custom claim set to admin.
		if (!callerRecord?.customClaims?.admin) {
			const userData = (
				await firebaseAdmin
					.firestore()
					.collection("users")
					.doc(uid)
					.get()
			).data();
			if (!userData?.admin) {
				// Throwing an HttpsError so that the client gets the error details.
				throw new firebaseFunctions.https.HttpsError(
					"failed-precondition",
					"This function must be called by a current authenticated administrator."
				);
			}
		}

		if (!uid) {
			throw new firebaseFunctions.https.HttpsError(
				"invalid-argument",
				"No user ID was provided"
			);
		}

		try {
			// first, check that the user exists
			const userRecord = await firebaseAdmin.auth().getUser(uid);
			if (!userRecord) {
				return {
					error: true, // don't use functions.https.HttpsError because we want to be able to return a custom error code
					firebaseError: false,
					code: "no-user",
					message: "No user exists with the given user ID",
				};
			}

			// the preconditions for updating the status have passed. We can now update their status to admin:true.
			await Promise.all([
				firebaseAdmin.auth().setCustomUserClaims(uid, { admin: true }),
				firebaseAdmin
					.firestore()
					.collection("users")
					.doc(uid)
					.update({
						admin: true,
					}),
			]);

			return {
				error: false,
				message:
					"The user's custom claim and firestore data have been updated.",
			};
		} catch (error) {
			console.log(error);
			return {
				error: true,
				firebaseError: true,
				code: error.code,
				message: error.message,
				errorObject: error,
			};
		}
	}
);
