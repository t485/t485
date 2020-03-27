import * as firebase from "firebase-admin";
import QueryDocumentSnapshot = firebase.firestore.QueryDocumentSnapshot;

function deleteQueryBatch(
	db: firebase.firestore.Firestore,
	query: any,
	resolve: any,
	reject: any
): void {
	query
		.get()
		.then((snapshot: any) => {
			// When there are no documents left, we are done
			if (snapshot.size === 0) {
				return 0;
			}

			// Delete documents in a batch
			const batch = db.batch();
			snapshot.docs.forEach((doc: QueryDocumentSnapshot) => {
				batch.delete(doc.ref);
			});

			return batch.commit().then(() => {
				return snapshot.size;
			});
		})
		.then((numDeleted: number) => {
			if (numDeleted === 0) {
				resolve();
				return;
			}

			// Recurse on the next process tick, to avoid
			// exploding the stack.
			process.nextTick(() => {
				deleteQueryBatch(db, query, resolve, reject);
			});
		})
		.catch(reject);
}

export default function deleteCollection(
	db: firebase.firestore.Firestore,
	collectionPath: string,
	batchSize: number
): Promise<void> {
	const collectionRef = db.collection(collectionPath);
	const query = collectionRef.orderBy("__name__").limit(batchSize);

	return new Promise((resolve, reject) => {
		deleteQueryBatch(db, query, resolve, reject);
	});
}
