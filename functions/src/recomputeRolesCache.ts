import * as functions from "firebase-functions";
import admin from "./firebaseAdmin";
import deleteCollection from "./utils/deleteCollection";
import "./utils/arrayBinaryIndexOf";

type RecomputeRolesCacheSettings =
	| { mode: "single"; userID: string }
	| { mode: "all" };
// recomputing all is a heavy task that could prevent other users from performing actions, so the user must forcibly acknowledge it, instead of being allowed to do it if they forget the userId parameter.
export const recomputeRolesCache = functions.https.onCall(
	async (settings: RecomputeRolesCacheSettings, context) => {
		// Don't ensure auth for now, it has little use.
		// if (!context.auth || !context.auth.uid) {
		// 	throw new functions.https.HttpsError("unauthenticated", "Recomputing the roles cache can only be performed by an authenticated user.");
		// }

		// // validate args since typescript cant do that at compile time because data is user provided
		if (
			(settings.mode !== "single" && settings.mode !== "all") ||
			(settings.mode === "single" && !settings.userID)
		) {
			throw new functions.https.HttpsError("invalid-argument", "");
		}

		const users: {
			id: string;
			groups?: string[];
			permissions?: string[];
			admin: boolean;
		}[] = [];
		if (settings.mode === "single") {
			/*
			There are four things we want to look at from user data: Admin, Roles, Jobs, and Permissions

				If the user is an admin (userData.admin === true), then they get every permission.
				Otherwise, they get the permission (of the appropriate read/write) if the groups array of that permission contains
					`role:<a role they have>` or `job:<a job they have>`
				If  that isn't true, they still get the permission if their permissions array contains the name of the permission, based on whether it says read or write
					e.g. if the user's permission array is ["users:data:read"] then they can read user data
							if the user's permission array is ["users:data:write"] then they can read and write user data

		 */
			const userDataSnapshot = await admin
				.firestore()
				.collection("users")
				.doc(settings.userID)
				.get();
			const dbData = userDataSnapshot.data();
			// sort it so that we can do binary search later
			users.push({
				id: settings.userID,
				groups: [
					...dbData?.roles?.map((role: string) => `role:${role}`),
					...dbData?.jobs?.map((job: string) => `job:${job}`),
				].sort(),
				permissions: dbData?.permissions?.sort(),
				admin: dbData?.admin,
			});
		} else {
			const usersSnapshot = await admin
				.firestore()
				.collection("users")
				.get();
			usersSnapshot.forEach(doc => {
				// doc.data() is never undefined for query doc snapshots
				console.log(doc.id, " => ", doc.data());
				const userData = doc.data();
				users.push({
					id: doc.id,
					groups: [
						...(userData.roles || []).map((role: string) => `role:${role}`),
						...(userData.jobs || []).map((job: string) => `job:${job}`),
					].sort(),
					permissions: userData.permissions?.sort(),
					admin: userData.admin,
				});
			});
		}
		console.log(users);

		// Then, for each permission, add the users if necessary.
		const permissionsSnapshot = await admin
			.firestore()
			.collection("permissions")
			.get();
		permissionsSnapshot.forEach(doc => {
			const permissionName = doc.id;
			const data = doc.data();

			// below MIGHT BE UNDEFINED
			const readGroups = data.read;
			const writeGroups = data.write;

			// Delete all children if this is the 'all' mode, otherwise only the user's entry
			let promise: Promise<any>;
			if (settings.mode === "all") {
				promise = deleteCollection(
					admin.firestore(),
					`/permissions/${permissionName}/users`,
					200
				);
			} else {
				promise = admin
					.firestore()
					.collection("permissions")
					.doc(permissionName)
					.collection("users")
					.doc(settings.userID)
					.delete();
			}
			promise
				.then(() => {
					users.forEach(user => {
						// .some: at least one passes the test
						const canWrite =
							user.admin ||
							(user.permissions &&
								user.permissions.binaryIndexOf(
									`permission:${permissionName}:write`
								) > -1) ||
							writeGroups?.some(
								(groupName: string) =>
									user.groups && user.groups.binaryIndexOf(groupName) > -1
							);

						const canRead =
							canWrite ||
							(user.permissions &&
								user.permissions.binaryIndexOf(
									`permission:${permissionName}:read`
								) > -1) ||
							readGroups?.some(
								(groupName: string) =>
									user.groups && user.groups.binaryIndexOf(groupName) > -1
							);

						// guaranteed that if they can write they can also read
						if (canRead) {
							admin
								.firestore()
								.collection("permissions")
								.doc(permissionName)
								.collection("users")
								.doc(user.id)
								.set({
									read: canRead,
									write: canWrite,
								})
								.catch(e => {
									console.log(e);

									throw new functions.https.HttpsError(
										"internal",
										"function promise failed:" +
											e.code +
											"     /     " +
											e.message
									);
								});
						}
					});
				})
				.catch(e => {
					console.log(e);
					throw new functions.https.HttpsError(
						"internal",
						"function promise failed:" + JSON.stringify(e)
					);
				});
		});
	}
);
