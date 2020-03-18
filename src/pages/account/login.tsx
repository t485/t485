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
import firebase from "../../components/server/firebase";
import { navigate } from "gatsby";

export default function LoginPage({
	location,
}: {
	location: { state: AuthContinueState };
}): ReactElement {
	console.log(location);
	const state = addToChain(location.state, "login");
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
						<a>Need An Account?</a> |{" "}
						<a
							onClick={(): void => {
								navigate("/account/forgotpassword", {
									state: state,
								});
							}}
						>
							Forgot Your Password?
						</a>
					</p>
				}
				buttonLabel={state?.message ? "Continue" : "Login"}
				onSubmit={({ email, password }, form): void => {
					firebase
						.auth()
						.signInWithEmailAndPassword(email, password)
						.then(() => {
							return onAuthSuccess(state);
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
