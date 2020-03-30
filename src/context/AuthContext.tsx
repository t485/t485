import React, { ReactElement, ReactNode, useEffect, useState } from "react";
import { firebase } from "../firebase";
import firebaseConfig from "../../firebase-config";

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
		if (typeof window !== "undefined") {
			if (firebase.apps.length === 0) {
				firebase.initializeApp(firebaseConfig);
			}
			setAuth(firebase.auth());
		}
	}, [firebase]);
	useEffect(() => {
		if (!auth) {
			return;
		}
		const unsubscribe = auth.onAuthStateChanged(
			(user: firebase.User | null) => {
				setLoading(false);
				setUser(user);
			}
		);
		return (): void => {
			unsubscribe();
		};
	}, [auth, firebase]);

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
