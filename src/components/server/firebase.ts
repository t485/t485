import firebase from "firebase";
import "firebase/auth";
import firebaseConfig from "../../../firebase-config";

if (!firebase.apps.length) {
	firebase.initializeApp(firebaseConfig);
}

export default firebase;
