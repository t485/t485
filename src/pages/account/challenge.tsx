import React, { ReactElement } from "react";
import { Layout, SEO } from "../../components/layout";
import {
	addToChain,
	AuthContinueState,
	AuthForm,
	FieldInputType,
	getErrorMessage,
	onAuthSuccess,
	useAuthState,
} from "../../components/auth";
import { navigate } from "gatsby";
import firebase from "../../components/server/firebase";

export default function AuthChallengePage({
	location: { state },
}: {
	location: { state: AuthContinueState };
}): ReactElement {
	const [user, loading] = useAuthState();
	if (state) {
		state = addToChain(state, "challenge");
	}
	console.log(loading);
	if (!user && !loading) {
		// User needs to login instead!
		navigate("/account/login", {
			state: state,
			replace: true,
		});
	}
	return (
		<Layout narrow>
			<SEO title={"Reauthenticate"} />
			<h1 className="text-center">
				{"Hi " + (user?.displayName.split(" ")[0] || "")}
			</h1>
			<p className="text-center text-muted">
				Please confirm your password to continue
			</p>
			<AuthForm
				fields={{
					password: {
						inputType: FieldInputType.PASSWORD,
						label: "Password",
						validation: {
							required: "You must enter a password.",
						},
					},
				}}
				buttonLabel={"Continue"}
				onSubmit={({ password }, form): void => {
					const credentials = firebase.auth.EmailAuthProvider.credential(
						user.email,
						password
					);
					user
						.reauthenticateWithCredential(credentials)
						.then(() => {
							return onAuthSuccess(state, "challenge");
						})
						.catch((e: firebase.FirebaseError) => {
							form.setErrors(getErrorMessage(e));
							form.setSubmitting(false);
						});
				}}
			/>
		</Layout>
	);
}
