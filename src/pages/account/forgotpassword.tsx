import React, { ReactElement } from "react";
import { Layout, SEO } from "../../components/layout";
import {
	addToChain,
	AuthContinueState,
	AuthForm,
	FieldInputType,
} from "../../components/auth";
import { unexpectedFirebaseError } from "../../utils/unexpectedError";
import { Link } from "gatsby";
import { useFirebase } from "../../firebase";
import { WindowLocation } from "@reach/router";

export interface ForgotPasswordState {
	email: string;
	continueState: AuthContinueState;
}

export default function ForgotPasswordPage({
	location,
}: {
	location: { state: AuthContinueState };
}): ReactElement {
	let state = location.state;
	const [successEmail, setSuccessEmail] = React.useState<string>("");
	const [noDisableButton, setNoDisableButton] = React.useState(false);
	const firebase = useFirebase();
	if (state) {
		state = addToChain(state, "forgotpassword");
	}
	console.log(state);
	if (successEmail !== "") {
		return (
			<Layout narrow>
				<SEO title={"Reauthenticate"} />
				<h1 className="text-center">Check your inbox!</h1>
				<p>
					We&apos;ve sent an email containing a link to reset your password to{" "}
					<b>{successEmail}</b> (
					<a onClick={(): void => setSuccessEmail("")}>Not You?</a>).
				</p>
				<p className={"mt-4"}>
					<b>Didn&apos;t receive it yet?</b> On rare occasions, our emails may
					take up to 10 minutes to send.
				</p>
			</Layout>
		);
	}
	return (
		<Layout narrow>
			<SEO title={"Reauthenticate"} />
			{/*<Alert show={!!successEmail} variant={"success"} dismissible onClose={() => setSuccessEmail("")}>*/}
			{/*	<b>Check your inbox!</b> We&apos;ve sent an email to <b>{successEmail}</b>.*/}
			{/*</Alert>*/}
			<h1 className="text-center">Forgot Your Password?</h1>
			<p className="text-muted text-center">
				We can send you a password reset email.
			</p>
			<AuthForm
				fields={{
					email: {
						inputType: FieldInputType.EMAIL,
						label: "Your Email",
						validation: {
							required: "You must enter an email.",
						},
						helpText:
							"If you also forgot the email you signed up with, please contact the webmaster.",
					},
				}}
				tray={
					<p className={"text-center"}>
						<Link to={"/account/login"} state={state}>
							Login Instead
						</Link>{" "}
						|{" "}
						<Link to={"/account/howto"} state={state}>
							Need an Account?
						</Link>
					</p>
				}
				dontDisableButtonWithError={noDisableButton}
				buttonLabel={"Send Password Reset Email"}
				onSubmit={({ email }, form): void => {
					const lastResetEmail = parseInt(
						localStorage.getItem("lastResetEmail" + email)
					);
					const canTryAgain = new Date(lastResetEmail + 11 * 60 * 1000);
					const tryAgainHours =
						canTryAgain.getHours() > 12
							? canTryAgain.getHours() - 12
							: canTryAgain.getHours();
					const tryAgainTime =
						(tryAgainHours < 10 ? "0" : "") +
						tryAgainHours +
						":" +
						(canTryAgain.getMinutes() < 10 ? "0" : "") +
						canTryAgain.getMinutes() +
						(canTryAgain.getHours() < 12 ? "AM" : "PM");
					if (
						lastResetEmail &&
						new Date().getTime() - lastResetEmail < 10 * 60 * 1000
					) {
						// 1000 second buffer to prevent errors.
						const timeLeft =
							lastResetEmail + 10 * 60 * 1000 - new Date().getTime() + 1000;
						form.setErrors({
							email:
								"You can't send a password reset email to the same address more than once every 10 to 15 minutes. Try again at " +
								tryAgainTime +
								".",
						});
						setNoDisableButton(true);

						form.setSubmitting(false);
						return;
					}
					const actionCodeSettings: firebase.auth.ActionCodeSettings = {
						url:
							"https://t485.org/?state=" +
							encodeURIComponent(
								JSON.stringify({
									email: email,
									continueState: state,
								} as ForgotPasswordState)
							),
					};
					firebase
						.auth()
						.sendPasswordResetEmail(email, actionCodeSettings)
						.then(function() {
							// Email sent.
							localStorage.setItem(
								"lastResetEmail" + email,
								"" + new Date().getTime()
							);
							setSuccessEmail(email);
							form.setSubmitting(false);
						})
						.catch(function(error) {
							switch (error.code) {
								case "auth/user-not-found":
									form.setErrors({
										email: "No account exists with this email.",
									});
									break;
								case "auth/too-many-requests":
									form.setErrors({
										email:
											"We have blocked all requests from this device due to unusual activity. Please try again later.",
									});
									break;
								default:
									form.setErrors({
										email: unexpectedFirebaseError(error),
									});
							}
							console.log(error);
							form.setSubmitting(false);
						});
				}}
			/>
		</Layout>
	);
}
