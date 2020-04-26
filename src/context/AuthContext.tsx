import React, { ReactElement, ReactNode, useEffect, useState } from "react";
import firebaseConfig from "../../firebase-config";
import { User as FirebaseUser } from "firebase";
const AuthContext = React.createContext({
	user: null,
	loading: true,
	error: null,
});

const AuthProvider = ({ children }: { children: ReactNode }): ReactElement => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [auth, setAuth] = React.useState(null);
	React.useEffect(() => {
		(async (): Promise<void> => {
			// import firebase app
			const firebaseApp: any = await import("firebase/app");
			//
			await Promise.all([
				import("firebase/auth"),
				import("firebase/firestore"),
				import("firebase/functions"),
			]);
			// lazy load firebase in an async IIFE
			if (firebaseApp.apps.length === 0) {
				firebaseApp.initializeApp(firebaseConfig);
			}
			setAuth(firebaseApp.auth());
		})();
	}, []);
	useEffect(() => {
		if (!auth) {
			return;
		}
		const unsubscribe = auth.onAuthStateChanged((user: FirebaseUser | null) => {
			setUser(user);
			setLoading(false);
		});
		return (): void => {
			unsubscribe();
		};
	}, [auth]);

	return (
		<AuthContext.Provider
			value={{
				user,
				loading,
				error,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthContext;
export { AuthProvider };
