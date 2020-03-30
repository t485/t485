import React from "react";
import firebaseConfig from "../../firebase-config";
import firebase from "./firebase";

// This hook might be poorly named.
// However, useInitializationState doesn't sound right, because this function actually does initialize it
// and useFirebase doesn't sound right because this function doesn't return firebase
// also, this function can't return firebase, because that breaks typescript types (since it has to return firebase.App, but then that breaks
// firebase.firestore.FieldValue, because in that case, firestore refers to the namespace, but typescript doesn't understand that.)
// But then again, this is kind of an async function
export default function useFirebaseInitializer(): boolean {
	const [ready, setReady] = React.useState(false);
	React.useEffect(() => {
		if (typeof window !== "undefined") {
			if (firebase.apps.length === 0) {
				firebase.initializeApp(firebaseConfig);
			}
			setReady(true);
		}
	}, [firebase]);
	return ready;
}
