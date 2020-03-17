import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from "../../../firebase-config";

if (!firebase.apps.length && typeof window !== "undefined") {
	firebase.initializeApp(firebaseConfig);
}

export default firebase;
