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
import { useFirebase } from "../../firebase";

export default function LoginPage({
	location: { state },
}: {
	location: { state: AuthContinueState };
}): ReactElement {
	const firebase = useFirebase();
	if (state) {
		state = addToChain(state, "login");
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
							Create An Account
						</Link>{" "}
						|{" "}
						<Link to={"/account/forgotpassword"} state={state}>
							Forgot Password
						</Link>
					</p>
				}
				buttonLabel={state?.message ? "Continue" : "Login"}
				onSubmit={({ email, password }, form): void => {
					firebase
						.auth()
						.signInWithEmailAndPassword(email, password)
						.then(() => {
							firebase
								.auth()
								.currentUser.getIdTokenResult()
								.then(({ claims }) => {
									console.log(claims);
									if (claims.setupComplete) {
										return onAuthSuccess(state, "login");
									} else {
										navigate("/account/setup");
									}
								});
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
