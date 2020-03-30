import React, { ReactElement } from "react";
import { Layout, SEO } from "../../components/layout";
import {
	addToChain,
	AuthContinueState,
	AuthForm,
	FieldInputType,
	getErrorMessage,
	onAuthSuccess,
} from "../../components/auth";
import { Link, navigate } from "gatsby";
import { firebase, useFirebaseInitializer } from "../../firebase";

export default function LoginPage({
	location,
}: {
	location: { state: AuthContinueState };
}): ReactElement {
	console.log(location);
	let state = location.state;
	if (location.state) {
		state = addToChain(location.state, "login");
	}
	console.log(state);
	return (
		<Layout narrow>
			<SEO title={"Reauthenticate"} />
			<h1 className="text-center">
				{"Login" + (state?.message ? " to Continue" : "")}
			</h1>
			{/*<p className="text-center text-muted">Please confirm your password to continue</p>*/}
			<AuthForm
				fields={{
					email: {
						inputType: FieldInputType.EMAIL,
						label: "Your Email",
						validation: {
							required: "You must enter an email.",
						},
					},
					password: {
						inputType: FieldInputType.PASSWORD,
						label: "Your Password",
						validation: {
							required: "You must enter a password",
						},
					},
				}}
				tray={
					<p className={"text-center"}>
						<Link to={"/account/howto"} state={state}>
							Need an Account?
						</Link>{" "}
						|{" "}
						<Link to={"/account/forgotpassword"} state={state}>
							Forgot Your Password?
						</Link>
					</p>
				}
				buttonLabel={state?.message ? "Continue" : "Login"}
				onSubmit={({ email, password }, form): void => {
					firebase
						.auth()
						.signInWithEmailAndPassword(email, password)
						.then(() => {
							return onAuthSuccess(state, "login");
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
