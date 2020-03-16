import React, { ReactElement } from "react";
import { Layout, SEO } from "../../components/layout";
import { Button, Form } from "react-bootstrap";
import { Field, Formik, FormikBag } from "formik";
import * as Yup from "yup";
import firebase from "../../components/server/firebase";
import { AuthContinueState } from "../../components/auth/AuthContinueState";

const ForgotPasswordPage = ({ location }): ReactElement => {
	const continueData = location.state as AuthContinueState;
	const continueState = {
		test: "true",
	};

	interface FormData {
		email: string;
	}

	const handleSubmit = (
		{ email }: FormData,
		{ setSubmitting }: FormikBag<FormData, FormData>
	): void => {
		console.log("HELLO");
		const actionCodeSettings: firebase.auth.ActionCodeSettings = {
			url:
				"https://beta.t485.org/?email=" +
				email +
				"&continueState=" +
				encodeURIComponent(JSON.stringify(continueState)),
		};
		firebase
			.auth()
			.sendPasswordResetEmail(email, actionCodeSettings)
			.then(function() {
				// Email sent.
				console.log("DONE");
				setSubmitting(false);
			})
			.catch(function(error) {
				// An error happened.
				console.log("ERROR", error);
				setSubmitting(false);
			});
	};
	const schema = Yup.object().shape({
		email: Yup.string()
			.email("The email you entered isn't valid.")
			.required("Please enter an email"),
	});
	return (
		<Layout
			style={{
				top: "15vh",
				maxWidth: "600px",
			}}
		>
			<SEO title="Forgot Password" />
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
				<h1 className="text-center">Reset Password</h1>
				<Formik
					validationSchema={schema}
					initialValues={{
						email: "",
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
							<Form.Group controlId="authEmail">
								<Form.Label>Email address</Form.Label>
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
							<Button
								variant={"primary"}
								block
								type={"submit"}
								disabled={!!(isSubmitting || errors.email)}
							>
								{errors.email ? "Fix errors to continue" : "Send Reset Email"}
							</Button>
						</Form>
					)}
				</Formik>
			</div>
		</Layout>
	);
};
export default ForgotPasswordPage;
