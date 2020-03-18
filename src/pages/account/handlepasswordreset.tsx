import React, { ReactElement } from "react";
import { Layout, SEO } from "../../components/layout";
import firebase from "../../components/server/firebase";
import { ForgotPasswordState } from "./forgotpassword";
import { addToChain, AuthForm, FieldInputType } from "../../components/auth";
import { Link, navigate } from "gatsby";
import { Button } from "react-bootstrap";

function useSessionStorage<T>(
	key: string,
	defaultValue: T
): [T, (newValue: T) => void] {
	let storageValue: string;
	if (typeof window !== "undefined") {
		storageValue = sessionStorage.getItem(key);
	} else {
		storageValue = "null";
	}
	const [state, setState] = React.useState(
		() => JSON.parse(storageValue) || defaultValue
	);
	React.useEffect(() => {
		sessionStorage.setItem(key, JSON.stringify(state));
	}, [key, state]);
	return [state, setState];
}

export interface PasswordResetState extends ForgotPasswordState {
	code: string;
}

export default function ActionPage({
	location,
}: {
	location: {
		state: PasswordResetState;
	};
}): ReactElement {
	// Persist the state
	const [success, setSuccess] = useSessionStorage("success", false);
	const defaultStateValue: PasswordResetState = location.state
		? {
				code: location.state.code,
				email: location.state.email,
				continueState: addToChain(
					location.state.continueState,
					"handlepasswordreset"
				),
		  }
		: undefined;
	console.log(defaultStateValue);
	const [state, setState] = useSessionStorage<undefined | PasswordResetState>(
		"state",
		defaultStateValue
	);
	if (location?.state && state?.code !== location?.state?.code) {
		// the persisted state could contain an outdated object from a previous password reset
		setState(defaultStateValue);
		setSuccess(false);
	}
	const [verified, setVerified] = React.useState(false);
	const [error, setError] = React.useState<
		| undefined
		| {
				title: string;
				description: ReactElement;
		  }
	>();
	React.useEffect(() => {
		if (success) return;
		if (!state?.code) {
			setError({
				title: "Session Expired",
				description: (
					<p>
						Your session has expired. Please click the original link in the
						email again, or{" "}
						<Link to="/account/forgopassword">get a new link</Link>
					</p>
				),
			});
			return;
		}
		firebase
			.auth()
			.verifyPasswordResetCode(state.code)
			.then(function(email) {
				console.log(email);
				setVerified(true);
				//hi
			})
			.catch(error => {
				console.log(error);
				console.log(state);
				switch (error.code) {
					case "auth/expired-action-code":
						setError({
							title: "Link Expired",
							description: (
								<p>
									This link is no longer valid because a more recent one was
									issued.{" "}
									<Link
										to={"/account/forgotpassword"}
										state={state?.continueState}
									>
										Get a new link here
									</Link>
									.
								</p>
							),
						});
						break;
					case "auth/invalid-action-code":
						setError({
							title: "Invalid Link",
							description: (
								<p>
									This link is no longer valid because it is either expired,
									malformed, or has already been used.{" "}
									<Link
										to={"/account/forgotpassword"}
										state={state?.continueState}
									>
										Get a new link here
									</Link>
									.
								</p>
							),
						});
				}
			});
	}, []);
	// React.useEffect(() => {
	//
	// 	//
	// }, [])
	console.log(location.state);
	let page: ReactElement;
	if (success) {
		page = (
			<>
				<SEO title="Choose a new password" />
				<h1 className="text-center">Success!</h1>
				<p className="text-muted">
					Your password has been changed. You can now login:
				</p>
				<Button
					variant={"primary"}
					block
					onClick={(): void => {
						navigate("/account/login", {
							state: state.continueState,
						});
					}}
				>
					Login
				</Button>
			</>
		);
	} else if (error) {
		page = (
			<>
				<h1>Error: {error.title}</h1>
				<>{error.description}</>
			</>
		);
	} else if (!verified) {
		page = (
			<>
				<SEO title="Choose a new password" />
				<h1>Loading...</h1>
			</>
		);
	} else {
		page = (
			<>
				<h1>Choose a new password</h1>
				<AuthForm
					fields={{
						newPassword: {
							inputType: FieldInputType.NEW_PASSWORD,
							label: "New Password",
						},
						confirmNewPassword: {
							inputType: FieldInputType.CONFIRM_PASSWORD,
							label: "Confirm New Password",
						},
					}}
					onSubmit={({ newPassword }): void => {
						firebase
							.auth()
							.confirmPasswordReset(state.code, newPassword)
							.then(function() {
								// Password reset has been confirmed and new password updated.

								// TODO: Display a link back to the app, or sign-in the user directly
								// if the page belongs to the same domain as the app:
								// auth.signInWithEmailAndPassword(accountEmail, newPassword);

								// TODO: If a continue URL is available, display a button which on
								// click redirects the user back to the app via continueUrl with
								// additional state determined from that URL's parameters.
								console.log("DONE");

								setSuccess(true);
							})
							.catch(function(error) {
								// Error occurred during confirmation. The code might have expired or the
								// password is too weak.
								console.log(error);
							});
					}}
					buttonLabel={"Set New Password"}
				/>
			</>
		);
	}
	return (
		<Layout narrow>
			<SEO title="Choose a new password" />
			{page}
		</Layout>
	);
}
