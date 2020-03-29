import React, { ReactElement } from "react";
import { Layout, SEO } from "../../components/layout";
import getParameterByName from "../../utils/getParameterByName";
import { addToChain, AuthForm, FieldInputType } from "../../components/auth";
import firebase from "../../components/server/firebase";
import { Button, Spinner } from "react-bootstrap";
import { Link, navigate } from "gatsby";
import { unexpectedFirebaseError } from "../../utils/unexpectedError";
import useSessionStorage from "../../utils/useSessionStorage";
import sysend from "sysend";

const ActionPage = (): ReactElement => {
	type UIMode =
		| "loading"
		| "get_new_password"
		| "change_password_complete"
		| "account_email_recovery_complete"
		| "verify_email_complete";
	type SuccessUIMode =
		| "change_password_complete"
		| "account_email_recovery_complete"
		| "verify_email_complete";
	type SuccessData = {
		page: SuccessUIMode;
		data?: {
			email?: string;
			passwordResetEmailSent?: boolean;
		};
	};
	const [success, setSuccess] = useSessionStorage<false | SuccessData>(
		"authAction-successMode",
		false
	);
	const [passwordResetEmailSent, setPasswordResetEmailSent] = React.useState(
		(success && success.data?.passwordResetEmailSent) || false
	);
	const [uiMode, setUIMode] = React.useState<UIMode>(
		(success && success.page) || "loading"
	);
	const [restoredEmail, setRestoredEmail] = React.useState<string>(
		(success && success.data?.email) || ""
	);
	const [error, setError] = React.useState<
		| undefined
		| {
				title: string | ReactElement;
				message: string | ReactElement;
		  }
	>();

	const data = React.useMemo(() => {
		if (typeof window === "undefined") {
			return null;
		}
		const url = window.location.href;
		// Get the action to complete.
		const mode = getParameterByName("mode", url);
		// Get the one-time code from the query parameter.
		const actionCode = getParameterByName("oobCode", url);
		// (Optional) Get the continue URL from the query parameter if available.
		// continueUrl is a url that contains a query string named state with the state.
		const continueData = JSON.parse(
			getParameterByName("state", getParameterByName("continueUrl", url))
		);

		return {
			url,
			mode,
			actionCode,
			email: continueData?.email,
			continueState: continueData
				? addToChain(continueData.continueState, `accountaction:${mode}`)
				: undefined,
		};
	}, []);

	function handleGeneralError(error: {
		code: string;
		message:
			| "auth/expired-action-code"
			| "auth/invalid-action-code"
			| "auth/user-disabled"
			| "auth/user-not-found";
	}): {
		title: string;
		message: string;
	};
	function handleGeneralError(error: {
		code: string;
		message: string;
	}): {
		title: string;
		message: string | ReactElement;
	};
	function handleGeneralError(error: {
		code: string;
		message: string;
	}): {
		title: string;
		message: string | ReactElement;
	} {
		switch (error.code) {
			// NOTE: only default can be a react element. All other conditions MUST be a string
			case "auth/expired-action-code":
				return {
					title: "Link Expired",
					message: "This link is no longer valid because it has expired.",
				};
			case "auth/invalid-action-code":
				return {
					title: "Link already used",
					message:
						"This link is no longer valid because it has either already been used, or is malformed.",
				};
			case "auth/user-disabled":
				return {
					title: "Account Disabled",
					message:
						"We are unable to process this request because your account has been disabled. " +
						"If you believe this is an error, please contact the webmaster.",
				};
			case "auth/user-not-found":
				return {
					title: "Account Deleted",
					message:
						"We are unable to process this request because your account has been deleted. " +
						"If you believe this is an error, please contact the webmaster.",
				};
			default:
				return {
					title: "Error: " + error.code,
					message: unexpectedFirebaseError(error, true),
				};
		}
	}

	React.useEffect(() => {
		const handler = async (): Promise<void> => {
			if (success) {
				// don't recompute since we know the action is already finished.
				return;
			}

			if (!data.mode || !data.actionCode) {
				setError({
					title: "Malformed Link",
					message:
						"If you got to this page by clicking on a link from a t485 email, then please contact the webmaster. " +
						"This page can only be accessed through an access link, typically sent to you in an email as part of the password reset, " +
						"change email, or email verification process. ",
				});
				return;
			}
			// Handle the user management action.
			switch (data.mode) {
				case "resetPassword":
					try {
						await firebase.auth().verifyPasswordResetCode(data.actionCode);
						setUIMode("get_new_password");
					} catch (error) {
						console.log(error);
						switch (error.code) {
							case "auth/expired-action-code":
								setError({
									title: "Link Expired",
									message: (
										<>
											<p>
												This link is no longer valid because it has expired.
											</p>
											<p>
												<Link
													to={"/account/forgotpassword"}
													state={data.continueState}
												>
													Get a new link
												</Link>
												.
											</p>
										</>
									),
								});
								break;
							case "auth/invalid-action-code":
								setError({
									title: "Link already used",
									message: (
										<>
											<p>
												This link is no longer valid because it has either
												already been used or is malformed.
											</p>
											<p>
												<Link
													to={"/account/forgotpassword"}
													state={data.continueState}
												>
													Get a new link
												</Link>
												.
											</p>
										</>
									),
								});
								break;
							// handle the following cases like default case
							// case "auth/user-disabled":
							// case "auth/user-not-found":
							default:
								setError(handleGeneralError(error));
						}
					}
					break;
				case "recoverEmail":
					try {
						const info = await firebase.auth().checkActionCode(data.actionCode);
						setRestoredEmail(info.data.email);
						await firebase.auth().applyActionCode(data.actionCode);
						await firebase
							.auth()
							.signOut()
							.catch(error => {
								console.log(error);
								/* do nothing, signing out isn't a necessary function (the catch block won't catch anything
								 because we've already handled the error here.) */
							});

						// Account email reverted to restoredEmail
						setSuccess({
							page: "account_email_recovery_complete",
							data: { email: info.data.email },
						});
						setUIMode("account_email_recovery_complete");
					} catch (error) {
						// invalid code
						setError(handleGeneralError(error));
					}

					break;
				case "verifyEmail":
					try {
						const info = await firebase.auth().checkActionCode(data.actionCode);
						await firebase.auth().applyActionCode(data.actionCode);
						setSuccess({
							page: "verify_email_complete",
							data: { email: info.data.email },
						});
						console.log(info);
						setUIMode("verify_email_complete");
						sysend.broadcast("email_verified", { email: info.data.email });
						// console.log("SENT", sysend);
					} catch (error) {
						// invalid code
						setError(handleGeneralError(error));
					}

					break;
				default:
					setError({
						title: "Invalid Link",
						message: "The link you used to access this page is malformed.",
					});
				// Error: invalid mode.
			}
		};
		handler();
	}, []);

	let content: ReactElement;
	if (error) {
		content = (
			<>
				<SEO title="Account Action: Error" />
				<h1>
					Error{error && ":"} {error?.title}
				</h1>
				{typeof error.message === "string" ? (
					<p>{error.message}</p>
				) : (
					error?.message
				)}
			</>
		);
	} else {
		switch (uiMode) {
			case "loading":
				content = (
					<>
						<SEO title="Account Action (Loading...)" />
						<div className="text-center">
							<Spinner animation={"border"} className={"my-4"} />
							<h3>Loading</h3>
							<p>Please wait while we process your request.</p>
						</div>
					</>
				);
				break;
			case "get_new_password":
				content = (
					<>
						<SEO title="Choose a new password" />
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
							onSubmit={({ newPassword }, form): void => {
								firebase
									.auth()
									.confirmPasswordReset(data.actionCode, newPassword)
									.then(function() {
										// Password reset has been confirmed and new password updated.
										setSuccess({ page: "change_password_complete" });
										setUIMode("change_password_complete");
									})
									.catch(function(error) {
										//TODO
										// Error occurred during confirmation. The code might have expired or the
										// password is too weak.
										console.log(error);
										switch (error.code) {
											case "auth/weak-password":
												form.setErrors({
													newPassword:
														"The password is not strong enough. " +
														"Try adding a combination of uppercase and lowercase letters, numbers, and symbols.",
												});
												form.setSubmitting(false);
												break;
											case "auth/expired-action-code":
											case "auth/invalid-action-code":
											case "auth/user-disabled":
											case "auth/user-not-found":
												form.setErrors({
													newPassword: handleGeneralError(error).message,
												});
												break;
											default:
												form.setErrors({
													newPassword: unexpectedFirebaseError(error),
												});
												form.setSubmitting(false);
										}
									});
							}}
							buttonLabel={"Set New Password"}
						/>
					</>
				);
				break;
			case "change_password_complete":
				content = (
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
									state: data.continueState,
								});
							}}
						>
							Login
						</Button>
					</>
				);
				break;
			case "account_email_recovery_complete":
				content = (
					<>
						<SEO title="Restore Email" />
						<h1 className="text-center">Success!</h1>
						<p className="text-muted">
							We&apos;ve successfully changed your account email back to{" "}
							<b>{restoredEmail}</b>.
						</p>
						<b>
							If your account was hacked, please change your password
							immediately.
						</b>
						{passwordResetEmailSent ? (
							<p className="text-success text-center mt-2">
								<b>Success!</b> Sent email to {restoredEmail}.{" "}
								<Link to={"/account/forgotpassword"}>
									Visit the reset password page to send it again
								</Link>
							</p>
						) : (
							<Button
								variant={"primary"}
								block
								onClick={async (): Promise<void> => {
									try {
										// set the success stuff to true so we don't have to implement a loading indicator
										// it shouldn't matter anyways because emails normally take some time to recieve
										// and if there is an error they will be redirected.
										setPasswordResetEmailSent(true);
										setSuccess(prevState => {
											if (prevState === false) {
												return false;
											}

											return {
												...prevState,
												data: {
													...prevState.data,
													passwordResetEmailSent: true,
												},
											};
										});

										await firebase.auth().sendPasswordResetEmail(restoredEmail);
									} catch (error) {
										alert(JSON.stringify(error));
										// if there are any errors send them to the normal reset email page
										navigate("/account/forgotpassword");
									}
								}}
							>
								Send password reset email
							</Button>
						)}

						<Button
							variant={"secondary"}
							block
							onClick={(): void => {
								navigate("/account/login");
							}}
						>
							Login
						</Button>
					</>
				);
				break;
			case "verify_email_complete":
				content = (
					<>
						<SEO title="Email Verified" />
						<h1 className="text-center">
							Success! Your email has been verified.
						</h1>
						<p>
							To continue setting up your account, return to the first tab that
							you used to setup your account. If you&apos;ve closed that tab,
							simply login again, and you will be brought back to that page.
						</p>
					</>
				);
				break;
			default:
				content = (
					<>
						<SEO title="Account Action: Error" />
						<h1>
							Internal Error: Unreachable UIMode State ({JSON.stringify(uiMode)}
							)
						</h1>
						<p>
							Please contact the webmaster. Include a screenshot of this page.
						</p>
					</>
				);
		}
	}
	return <Layout narrow>{content}</Layout>;
};

export default ActionPage;
