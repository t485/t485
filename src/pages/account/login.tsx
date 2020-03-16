import React, {ReactElement} from "react";
import {Button, Form} from "react-bootstrap";
import {navigate} from "gatsby-link";
import Layout from "../../components/layout/Layout";
import SEO from "../../components/layout/seo";
import {Field, Formik, FormikBag} from "formik";
import * as Yup from "yup";
import firebase from "../../components/server/firebase";
import {WindowLocation} from "reach__router";
import {AuthContinueState, AuthReturnState, useAuthState,} from "../../components/auth";
import {User} from "firebase";
// import {GoogleLoginButton} from "react-social-login-buttons"
import {unexpectedFirebaseError} from "../../utils/unexpectedError";

const LoginForm = ({
	                   continueTo,
	                   continueState,
	                   challengeUser,
	                   continueButton,
                   }: {
	continueTo: string;
	continueState?: object;
	challengeUser?: User;
	continueButton?: boolean;
}): ReactElement => {
	interface FormData {
		email?: string;
		password: string;
	}

	const schema = Yup.object().shape({
		email: challengeUser
			? undefined
			: Yup.string()
				.email("The email you entered isn't valid.")
				.required("Please enter an email"),
		password: Yup.string().required("Please enter a password"),
	});

	const onAuthSuccess = (): void => {
		navigate(continueTo, {
			state: {
				from: "login",
				state: continueState || {},
			} as AuthReturnState,
			replace: true,
		});
	};

	const handleSubmit = (
		{email, password}: FormData,
		{setSubmitting, setErrors}: FormikBag<FormData, FormData>
	): void => {
		if (challengeUser) {
			const user = challengeUser;
			const credentials = firebase.auth.EmailAuthProvider.credential(
				user.email,
				password
			);
			// console.log(user, user.email, password)
			user.reauthenticateWithCredential(credentials)
				.then(onAuthSuccess)
				.catch(e => {
					console.log(e);
					switch (e.code) {
						case "auth/wrong-password":
							setErrors({
								password: "The password is incorrect.",
							});
							break;
						default:
							setErrors({
								password:
									"An unknown error occurred. Please contact the webmaster. Include the following Reference Data: \n\n" +
									unexpectedFirebaseError(e),
							});
					}
					setSubmitting(false);
				});
		} else {
			firebase
				.auth()
				.signInWithEmailAndPassword(email, password)
				.then(onAuthSuccess)
				.catch(e => {
					switch (e.code) {
						case "auth/user-disabled":
							setErrors({
								email:
									"Your account has been disabled. If you believe this is a mistake, please contact the webmaster.",
							});
							break;
						case "auth/wrong-password":
							setErrors({
								password: "The password is incorrect.",
							});
							break;
						case "auth/user-not-found":
						case "auth/invalid-email":
							setErrors({
								email: "No user exists with that email.",
							});
							break;
						default:
							setErrors({
								password: unexpectedFirebaseError(e),
							});
					}
					setSubmitting(false);
				});
		}
	};
	// const GoogleLoginButton = styled(Button)`
	//
	// 	background-color: rgb(203, 63, 34);
	// 	&:hover{
	// 		background-color: rgb(165, 51, 28);
	// 	}
	// 	&:active{
	// 		background-color: red !important;
	// 	}
	// `
	return (
		<>
			<Formik
				validationSchema={schema}
				initialValues={{
					email: "",
					password: "",
				}}
				onSubmit={handleSubmit}
			>
				{({
					  errors,
					  touched,
					  handleSubmit,
					  isSubmitting,
				  }: {
					errors: { [Field: string]: string };
					touched: { [Field: string]: boolean };
					handleSubmit: (e: React.FormEvent) => void;
					isSubmitting: boolean;
				}): ReactElement => (
					<Form onSubmit={handleSubmit}>
						{!challengeUser && (
							<Form.Group controlId="authEmail">
								<Form.Label>Email address</Form.Label>
								{/*<Form.Control*/}
								{/*    type="email"*/}
								{/*    placeholder="Enter your email..."*/}
								{/*    value={email}*/}
								{/*    onChange={(e): void => setEmail(e.target.value)}*/}
								{/*/>*/}
								<Field
									as={Form.Control}
									name={"email"}
									isInvalid={errors.email && touched.email}
									disabled={isSubmitting}
								/>
								<Form.Control.Feedback
									type="invalid"
									style={{
										whiteSpace: "pre-wrap",
										wordBreak: "break-all",
									}}
								>
									{errors.email}
								</Form.Control.Feedback>
							</Form.Group>
						)}
						<Form.Group controlId="authPassword">
							<Form.Label>Password</Form.Label>
							<Field
								as={Form.Control}
								name={"password"}
								type="password"
								isInvalid={errors.password && touched.password}
								disabled={isSubmitting}
							/>
							<Form.Control.Feedback type="invalid">
								{errors.password}
							</Form.Control.Feedback>
						</Form.Group>

						<p className="text-center">
							<a>Forgot Password</a>
							{!challengeUser && (
								<>
									{" "}
									| <a>Create Account</a>
								</>
							)}
						</p>

						<Button
							block
							variant="primary"
							type="submit"
							disabled={isSubmitting}
						>
							{isSubmitting
								? "Loading..."
								: continueButton
									? "Continue"
									: "Login"}
						</Button>
					</Form>
				)}
			</Formik>
			{/*<p className="text-divider my-4"><span className="text-divider-inner">OR</span></p>*/}
			{/*<GoogleLoginButton onClick={handleGoogleLogin}*/}
			{/*				   variant={"danger"}*/}
			{/*				   block*/}
			{/*				   className="text-left">*/}
			{/*	<FontAwesomeIcon icon={faGoogle}/>*/}
			{/*	{" "}*/}
			{/*	Login with Google</GoogleLoginButton>*/}
		</>
	);
};

const LoginPage = ({
	                   location,
                   }: {
	location: WindowLocation;
}): ReactElement => {
	const [user, ,] = useAuthState();

	let continuePath: string;
	const continueObj = location?.state as AuthContinueState;
	if (continueObj?.return) {
		if (continueObj?.return === true) {
			continuePath = continueObj?.from;
		} else {
			continuePath = continueObj?.return;
		}
	}
	// TODO: implement authform, then move the challenge mode out of this page so there is no flash
	console.log(continueObj);
	return (
		<Layout
			style={{
				top: "15vh",
				maxWidth: "600px",
			}}
		>
			<SEO title="Login"/>
			<div
				style={
					{
						// margin: "auto",
						// position: "absolute",
						// top: "50%",
						// transform: "translateY(-50%)"
					}
				}
			>
				<h1 className="text-center">
					{continueObj?.message
						? "Please login to continue"
						: continueObj?.isChallenge
							? "Hi " + (user?.displayName.split(" ")[0] || "")
							: "Login"}
				</h1>
				{continueObj?.isChallenge && (
					<p className="text-muted text-center">
						Please confirm your current password to continue.
					</p>
				)}
				<LoginForm
					continueState={continueObj?.state}
					continueTo={continuePath || "/"}
					challengeUser={continueObj?.isChallenge ? user : undefined}
					continueButton={
						!!continueObj?.return || !!continueObj?.isChallenge
					}
				/>
			</div>
		</Layout>
	);
};

export default LoginPage;
