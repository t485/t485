import * as functions from "firebase-functions";
import admin from "./firebaseAdmin";
import "./utils/arrayBinaryIndexOf";

export const updateSetupStatus = functions.https.onCall(
	async ({ uid }: { uid: string }, context) => {
		if (!uid) {
			throw new functions.https.HttpsError(
				"invalid-argument",
				"No user ID was provided"
			);
		}

		try {
			// first, check that the user exists, and their email is verified
			const userRecord = await admin.auth().getUser(uid);
			if (!userRecord) {
				return {
					error: true, // don't use functions.https.HttpsError because we want to be able to return a custom error code
					firebaseError: false,
					code: "no-user",
					message: "No user exists with the given user ID",
				};
			}
			if (!userRecord.emailVerified) {
				return {
					error: true,
					firebaseError: false,
					code: "email-not-verified",
					message: "The user's email has not been verified.",
				};
			}

			// next, check that user data exists.
			// the rules are structured such that user data can only exist if a valid key was used to sign up
			const userData = (
				await admin
					.firestore()
					.collection("users")
					.doc(uid)
					.get()
			).data(); // .data() should be called after the function has returned, thus (await xxx()).data() instead of await xxx().data()
			if (!userData || !userData.creationData) {
				return {
					error: true,
					firebaseError: false,
					code: "no-user-object",
					message:
						"The user object found on firebase either did not exist, or did not contain a valid creationData field",
				};
			}

			// the preconditions for updating the status have passed. We can now update their status to setupComplete:true.
			await Promise.all([
				admin.auth().setCustomUserClaims(uid, { setupComplete: true }),
				admin
					.firestore()
					.collection("users")
					.doc(uid)
					.update({
						setupComplete: true,
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
