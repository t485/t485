import React, { ReactElement } from "react";
import "../../styles/create.scss";
import "../../styles/stepper.scss";
import { AuthForm, FieldInputType, useAuthState } from "../../components/auth";
import { Layout, SEO } from "../../components/layout";
import classNames from "classnames";
import firebase from "../../components/server/firebase";
import { unexpectedFirebaseError } from "../../utils/unexpectedError";
import getParameterByName from "../../utils/getParameterByName";
import { Button, Spinner } from "react-bootstrap";
import { Link } from "gatsby";

function Arrows({
	labels,
	active,
}: {
	labels: string[];
	active: number;
}): ReactElement {
	const startPoints = "0,0 95,0 100,50 95,100 0,100";
	const middlePoints = "0,0 95,0 100,50 95,100 0,100 5,50";
	const endPoints = "0,0 100,0 100,100 0,100 5,50";
	const arrows = [];
	for (let i = 0; i < labels.length; i++) {
		arrows.push(
			<div
				key={i}
				className={classNames(
					"Arrows--step",
					i === active ? "Arrows--step__current" : "Arrows--step__coming"
				)}
			>
				<svg
					width="100%"
					height="100%"
					preserveAspectRatio="none"
					viewBox="0 0 100 100"
				>
					<polygon
						points={
							i === 0
								? startPoints
								: i === labels.length - 1
								? endPoints
								: middlePoints
						}
						className="Arrows--step--arrow"
					></polygon>
				</svg>
				<div className="Arrows--step--content">
					{/*<span className="Arrows--step--number">{i + 1}</span>*/}
					<span className="Arrows--step--label">{labels[i]}</span>
				</div>
			</div>
		);
	}
	return (
		<div
			className={classNames(
				"Arrows-container",
				`left-${active === 0 ? "dark" : "light"}-right-${
					active === labels.length - 1 ? "dark" : "light"
				}`
			)}
		>
			<div className="Arrows">{arrows}</div>
		</div>
	);
}

/**
 *
 * TODO TODO TODO TODO
 * State should be saved on reload. To do this, sae state to firebase, so any logged in user
 */
/*
 * SIGN UP FLOW
 * using a unique link, a user may sign up
 * then, they will enter their name, email, and password on PAGE 1
 * on PAGE 2, their email will be verified
 * on PAGE 3, they will be appointed permissions based on troop jobs and stuff?
 * NOTE: this should be very modular so it's easy to update in the future, which WILL be necessary.
 * */
export default function createAccountPage(): ReactElement {
	const [user, userLoading, userError] = useAuthState();
	const [step3Loading, setStep3Loading] = React.useState(false);
	type Data = {
		[key: string]: any;
	};
	type State = {
		step: number;
		data: Data;
		loading: boolean;
		success: boolean;
		error:
			| false
			| {
					code: string;
					message: string;
			  };
		emailVerified: boolean;
	};
	type Action =
		| {
				type:
					| "INCREMENT_STEP"
					| "DECREMENT_STEP"
					| "RESET_STEP"
					| "KEY_VERIFIED"
					| "INVALID_KEY"
					| "EXPIRED_KEY"
					| "EMAIL_VERIFIED";
		  }
		| { type: "ERROR"; title: string; message: string }
		| { type: "UPDATE_DATA"; data: Data; merge?: boolean }
		| { type: "INITIALIZE"; state: State };
	const [
		{ step, loading, success, error, emailVerified, data },
		dispatch,
	] = React.useReducer(
		(state: State, action: Action): State => {
			console.log(state, action);
			switch (action.type) {
				case "INCREMENT_STEP":
					return {
						...state,
						step: state.step + 1,
					};
				case "DECREMENT_STEP":
					return {
						...state,
						step: state.step - 1,
					};
				case "RESET_STEP":
					return {
						...state,
						step: 0,
					};
				case "UPDATE_DATA":
					return {
						...state,
						data:
							action.merge === false
								? action.data
								: { ...state.data, ...action.data },
					};
				case "KEY_VERIFIED":
					return {
						...state,
						loading: false,
						error: false,
						success: true,
					};
				case "INVALID_KEY":
					return {
						...state,
						loading: false,
						error: {
							code: "Invalid Link",
							message:
								"You can only create an account using a valid account creation link.",
						},
						success: false,
					};
				case "EXPIRED_KEY":
					return {
						...state,
						loading: false,
						error: {
							code: "Expired Link",
							message:
								"The link you used to access this page is now expired. This can happen if too much time has passed since you received it, or if " +
								"too many people have already used the link.",
						},
						success: false,
					};
				case "EMAIL_VERIFIED":
					return {
						...state,
						emailVerified: true,
						step: 2,
					};
				case "ERROR":
					return {
						...state,
						loading: false,
						error: {
							code: action.title,
							message: action.message,
						},
					};
				case "INITIALIZE":
					return action.state;
			}
		},
		{
			step: 0,
			data: {},
			loading: true,
			error: false,
			success: false,
			emailVerified: false,
		}
	);

	React.useEffect(() => {
		(async (): Promise<void> => {
			// a key can be verified in one of two ways: 1. the user uses a create link
			// OR 2. the logged in user hasn't finished setting up their account. In this case, they have the right to finish
			// setting up their account, even without a key.
			if (userLoading) return;

			if (user) {
				console.log(step, data, loading);
				if (step !== 0 || Object.keys(data).length !== 0 || loading !== true) {
					// we've inferred that the user was logged in as part of the create account process on this page
					// don't double increment
					return;
				}
				try {
					const userData = (
						await firebase
							.firestore()
							.collection("users")
							.doc(user.uid)
							.get()
					).data();
					if (userData.setupComplete) {
						dispatch({
							type: "INITIALIZE",
							state: {
								step: 3,
								data: {
									name: user.displayName,
									email: user.email,
								},
								loading: false,
								error: false,
								success: true,
								emailVerified: user.emailVerified,
							},
						});
						// dispatch({
						// 	type: "ERROR",
						// 	title: "Account already set up",
						// 	message: "We can't setup this account because the account has already been set up. If you are trying" +
						// 		" to create a new account, you have to logout first.",
						// });
						return;
					} else {
						dispatch({
							type: "INITIALIZE",
							state: {
								step: user.emailVerified ? 2 : 1,
								data: {
									name: user.displayName,
									email: user.email,
								},
								loading: false,
								error: false,
								success: true,
								emailVerified: user.emailVerified,
							},
						});
						const sysend = await import("sysend");
						sysend.on("email_verified", (data: { email: string }, name) => {
							console.log("RECEIVED EVENT", data, name);
							if (user.email === data.email)
								dispatch({ type: "EMAIL_VERIFIED" });
						});
						return;
					}
				} catch (error) {
					console.log(error);
					// assume the user is not logged in
				}
			}
			const key = getParameterByName("key");
			if (!key) {
				console.log("INVALID");
				dispatch({ type: "INVALID_KEY" });
				return;
			}
			firebase
				.firestore()
				.collection("accountcreationkeys")
				.doc(key)
				.get()
				.then(doc => {
					const data = doc.data();
					console.log(data);

					if (!data.maxUses || data.uses < data.maxUses) {
						dispatch({ type: "KEY_VERIFIED" });
					} else {
						dispatch({ type: "EXPIRED_KEY" });
					}
				})
				.catch(error => {
					console.log(error);
					dispatch({ type: "INVALID_KEY" });
				});
		})();
	}, [user, userLoading]);

	let content = <></>;
	if (step === 0) {
		content = (
			<AuthForm
				buttonLabel={"Next"}
				invalidButtonLabel={"Fix errors to continue"}
				buttonHelpText={
					"Clicking next will immediately send a verification email, so please double check that the email you provided is correct."
				}
				fields={{
					fullName: {
						inputType: FieldInputType.TEXT,
						label: "Your Full Name",
						placeholder: "Enter your full name...",
					},
					email: {
						inputType: FieldInputType.EMAIL,
						label: "Your Email",
					},
					newPassword: {
						inputType: FieldInputType.NEW_PASSWORD,
						label: "Choose a password",
					},
					confirmNewPassword: {
						inputType: FieldInputType.CONFIRM_PASSWORD,
						label: "Confirm your new password",
					},
				}}
				onSubmit={async (data, form): Promise<void> => {
					let user: firebase.User;
					let key: string;
					try {
						const credential = await firebase
							.auth()
							.createUserWithEmailAndPassword(data.email, data.newPassword);
						user = credential.user;
						key = getParameterByName("key");

						if (!user) {
							form.setErrors({
								email: unexpectedFirebaseError({
									code: "t485-internal/auth/user-not-found-after-submit",
									message:
										"Internal Error: The user was not found as part of the user credential after the new account " +
										"was created.",
								}),
							});
							form.setSubmitting(false);
							return;
						}
					} catch (error) {
						switch (error.code) {
							case "auth/weak-password":
								form.setErrors({
									newPassword:
										"This password is too weak. Try making it stronger by adding a combination of upper and lowercase letters, numbers, and symbols.",
								});
								break;
							case "auth/invalid-email":
								form.setErrors({
									email:
										"Sorry, but it looks like that isn't a valid email address. If you think this is a mistake, please contact the webmaster.",
								});
								break;
							case "auth/email-already-in-use":
								form.setErrors({
									email:
										"It looks like you already have a account under that email. Please login instead. If you haven't finished setting up, the setup page will" +
										" reappear after you login.",
								});
								break;
							default:
								form.setErrors({
									email: unexpectedFirebaseError(error),
								});
						}
						return;
					}
					// unfortunately, it doesn't look like these can be merged...
					// the errors must be handled differently.
					try {
						await Promise.all([
							user.updateProfile({
								displayName: data.fullName,
							}),
							firebase
								.firestore()
								.collection("users")
								.doc(user.uid)
								.set({
									name: data.fullName,
									admin: false,
									setupComplete: false,
									creationData: {
										date: firebase.firestore.FieldValue.serverTimestamp(),
										key: key,
									},
								}),
							firebase
								.firestore()
								.collection("accountcreationkeys")
								.doc(key)
								.set(
									{
										uses: firebase.firestore.FieldValue.increment(1),
									},
									{ merge: true }
								), // using .update would fail is uses didn't exist
						]);
						await user.sendEmailVerification();
						dispatch({ type: "UPDATE_DATA", data: { email: data.email } });
						console.log("LISTENING");
						const sysend = await import("sysend");
						sysend.on("email_verified", (data: { email: string }, name) => {
							console.log("RECEIVED EVENT", data, name);

							if (data.email === data.email)
								dispatch({ type: "EMAIL_VERIFIED" });
						});
					} catch (error) {
						console.log(error);

						// ROLLBACK: do cleanup, as much as possible.
						Promise.all(
							[
								user.delete(),
								firebase
									.firestore()
									.collection("users")
									.doc(user.uid)
									.delete(),
							].map(
								p => p.catch(e => console.log(e)) // each promise should fail by itself, and as it
								// isn't an essential function, we don't have to care if there is an error.
							)
						);

						// An error happened.
						form.setErrors({
							email: unexpectedFirebaseError(error),
						});
						form.setSubmitting(false);
						return;
					}

					// setsubmit before changing step because when step is changed, the form will become unmounted, which means that
					// there will notbing to set the submit of, which will cause a react warning.
					form.setSubmitting(false);
					dispatch({ type: "INCREMENT_STEP" });
					dispatch({
						type: "UPDATE_DATA",
						data: { name: data.name, email: data.email },
					});
				}}
			/>
		);
	} else if (step === 1) {
		content = (
			<>
				<p className={"text-muted"}>
					<b> Congratulations! </b> You have successfully created your t485
					account. However, before you can use this account you&apos;ll need to
					set it up. In the set up process, we will be verifying your email, and
					giving you an special permissions that your role in the troop(such as
					troop jobs) has access to.
				</p>
				<hr />
				<p>
					First, you&apos;ll need to <b>verify your email</b>. We&apos;ve
					already sent an email to <i>{data.email || "you"}</i>. Once you
					receive that email, click the link. You&apos;ll be taken to a new page
					where you can verify your email.
				</p>
				<p>
					Wrong email address?{" "}
					<a
						onClick={async (): Promise<void> => {
							// to reset, delete the account and log them out
							if (!user) {
								window.location.reload();
								return;
							}
							const key = await firebase
								.firestore()
								.collection("users")
								.doc(user.uid)
								.get()
								.then(snapshot => {
									const data = snapshot.data();
									console.log(data, key);
									return data?.creationData?.key;
								})
								.catch(error => {
									console.log(error);
									return "";
								});
							try {
								await Promise.all(
									[
										user.delete(),
										firebase
											.firestore()
											.collection("users")
											.doc(user.uid)
											.delete(),
										// .catch turns a error into a fulfilled process
										// this is good since each promise should fail independently.
									].map(promise => promise.catch(e => console.log(e)))
								);
							} catch (error) {
								console.log(error);
							}
							firebase
								.auth()
								.signOut()
								.then(() => {
									console.log(key);
									window.location.href =
										"/account/create?key=" + (key ? key : "");
								})
								.catch(error => {
									console.log(error, key);
									window.location.href =
										"/account/create?key=" + (key ? key : "");
								});
						}}
					>
						Click Here
					</a>{" "}
					(please note that you may need to request a new account creation link
					from the webmaster if the page says <i>invalid link</i> after you
					click this link)
				</p>
				<p>
					Once you verify your email, this page should automatically update. If
					it doesn&apos;t, <a href={""}>reload</a>.
				</p>
			</>
		);
	} else if (step === 2) {
		//TODO TODO TODO: implement
		content = (
			<>
				<p>
					Roles have not been implemented yet. They are not required for setting
					up your account.
				</p>
				<Button
					disabled={step3Loading}
					block
					onClick={(): void => {
						setStep3Loading(true);
						const updateSetupStatus = firebase
							.functions()
							.httpsCallable("updateSetupStatus");
						updateSetupStatus({
							uid: user.uid,
						})
							.then(data => {
								console.log("STEP 3 COMPLETE", data);
								user.getIdTokenResult(true).then(data => console.log(data));
								dispatch({ type: "INCREMENT_STEP" });
							})
							.catch(error => {
								console.log("ERROR", error);
							});
					}}
				>
					{step3Loading
						? "Loading... This could take up to 20 seconds."
						: "Click here to finish setting up your account"}
				</Button>
			</>
		);
	} else if (step === 3) {
		user
			.getIdTokenResult(true)
			.then(data => console.log(data))
			.catch(error => console.log(error));
		content = (
			<>
				<p>All Done! Your account has been all set up.</p>
				<p>You can now explore the website!</p>
			</>
		);
	}

	return (
		// Create uses custom css to set maxwidth, so it doesn't need to be `narrow`
		<Layout className={"create-account"}>
			<SEO title={"Create Account"} />
			{success && (
				<Arrows
					labels={[
						"Basic Information",
						"Email Verification",
						"Troop Job Abilities",
						"All Done!",
					]}
					active={step}
				/>
			)}

			<div className={"p-3 p-md-5"}>
				{loading && (
					<div className={"text-center"}>
						<Spinner animation={"border"} />
						<p>Please wait while we authenticate your request...</p>
					</div>
				)}
				{error && (
					<>
						<h1>Error: {error.code}</h1>
						<p>{error.message}</p>
						<p>
							If you are a member of troop 485, you can get a new account
							creation link by{" "}
							<a href="mailto:webmaster@t485.org?subject=Create%20T485%20Account">
								emailing the webmaster
							</a>
							.
						</p>
					</>
				)}
				{success && (
					<>
						<h1 className="text-center">
							{step === 0
								? "Create Account"
								: step === 3
								? "Setup Complete!"
								: "Setup Account"}
						</h1>

						{step === 0 && (
							<>
								<p>
									Welcome to the t485 website! Let&apos;s setup a new account
									for you. This process may take up to 10 minutes. If
									you&apos;ve already started setting up your account, then
									please <Link to={"/account/login"}>Login</Link> first, then
									you will be automatically redirected back to this page to
									finish setup.
								</p>
								<hr />
							</>
						)}

						{content}
					</>
				)}
			</div>
		</Layout>
	);
}
