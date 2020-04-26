import React, { ReactElement } from "react";
import { Layout, SEO } from "../../components/layout";
import { WindowLocation } from "@reach/router";
import { useFirebase } from "../../firebase";
import AuthContext from "../../context/AuthContext";
import { navigate } from "gatsby";
import { AuthContinueState } from "../../components/auth";
import Loadable from "../../components/loadable";
import {
	Alert,
	Button,
	Form,
	InputGroup,
	Overlay,
	Spinner,
	Tooltip,
} from "react-bootstrap";
import { Field, Formik } from "formik";
import * as Yup from "yup";

interface PageProps {
	location: WindowLocation;
}

export default function NotFoundPage({ location }: PageProps): ReactElement {
	const { user, loading, error } = React.useContext(AuthContext);
	const firebase = useFirebase();
	const [successAlert, setSuccessAlert] = React.useState({
		shortLink: "shortLink",
		toLink: "https://toLink.com",
	});
	if (!loading && !user) {
		navigate("/account/login", {
			state: {
				from: "/resources/linkshortener",
				message: true,
				return: true,
			} as AuthContinueState,
		});
	}
	const generateId = (count = 0, minLength = 5): Promise<string> => {
		return new Promise((resolve, reject) => {
			// no lowercase L or 0 to avoid ambiguity.
			const chars = "123456789abcdefghijkmnopqrstuvwxyz";
			let result = "";
			for (let i = minLength; i > 0; --i)
				result += chars[Math.floor(Math.random() * chars.length)];
			firebase
				.firestore()
				.collection("linkshortener")
				.doc(result)
				.get()
				.then(snapshot => {
					if (!snapshot.exists) {
						//done
						resolve(result);
					} else if (minLength > 10) {
						generateId(count + 1, minLength).then(generatedValue =>
							resolve(generatedValue)
						);
					} else if (count < 10) {
						generateId(0, minLength + 1).then(generatedValue =>
							resolve(generatedValue)
						);
					} else {
						resolve(
							firebase
								.firestore()
								.collection("linkshortener")
								.doc().id
						);
					}
				});
		});
	};
	const CopyLink = ({ link }: { link: string }): React.ReactElement => {
		const [show, setShow] = React.useState(false);
		const [timeoutID, setTimeoutID] = React.useState();
		const linkRef = React.useRef(null);
		return (
			<>
				<Alert.Link
					ref={linkRef}
					onClick={(): void => {
						navigator.clipboard.writeText(link);
						setShow(true);
						if (timeoutID) {
							clearTimeout(timeoutID);
						}
						setTimeoutID(setTimeout(() => setShow(false), 3000));
					}}
				>
					copy short link to clipboard
				</Alert.Link>

				<Overlay show={show} target={linkRef.current} placement={"top"}>
					{(props): void => (
						<Tooltip id={`tooltip-short-link-copy`} {...props}>
							Copied!
						</Tooltip>
					)}
				</Overlay>
			</>
		);
	};
	return (
		<Layout location={location}>
			<SEO title="Link Shortener" />
			<h1>Troop 485 Link Shortener</h1>
			{user && (
				<p>
					Hello, <b>{user?.displayName || user?.email}</b>. Your account will be
					privately linked to any short links you create.
				</p>
			)}
			<hr />
			<Loadable loading={loading || !user} loadingText={"Authenticating..."}>
				{successAlert && (
					<Alert
						variant={"success"}
						dismissible
						onClose={(): void => setSuccessAlert(null)}
					>
						<b>Success!</b> The short link{" "}
						<b>https://link.t485.org/{successAlert.shortLink}</b> now redirects
						to <b>{successAlert.toLink}</b>. (
						<CopyLink
							link={"https://link.t485.org/" + successAlert.shortLink}
						/>
						)
					</Alert>
				)}
				<Formik
					validationSchema={Yup.object({
						shortLink: Yup.string()
							.max(128, "The short URL must be 128 or fewer characters")
							.lowercase()
							.matches(
								/^[a-zA-Z0-9][a-zA-Z0-9\-_]*$/,
								"The short URL may only contain letters, numbers, hyphens and underscores, and must start with a letter or number."
							)
							.required("The short URL is required."),
						toLink: Yup.string()
							.max(
								2048,
								"You may not redirect to a URL longer than 2048 characters."
							)
							.matches(
								/^((\b(https?|ftp|file):\/\/)[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]$)|mailto:.+/,
								"The URL to redirect to is invalid. Remember to include http or https."
							)
							.required("The URL to redirect to is required."),
					})}
					initialValues={{
						shortLink: "",
						toLink: "",
						enableAnalytics: true,
						enablePreview: true,
					}}
					onSubmit={(data, form): void => {
						(async (): Promise<void> => {
							console.log(data);
							const snapshot = await firebase
								.firestore()
								.collection("linkshortener")
								.doc(data.shortLink)
								.get();
							if (snapshot.exists) {
								form.setErrors({
									shortLink:
										"The short link you provided has already been taken. Please choose a new name or click the 'random' button for a new random short link.",
								});
								form.setSubmitting(false);
								return;
							}
							await firebase
								.firestore()
								.collection("linkshortener")
								.doc(data.shortLink)
								.set({
									version: 1,
									to: data.toLink,
									disabled: false,
									created: firebase.firestore.FieldValue.serverTimestamp(),
									disablePreview: !data.enablePreview,
									clickAnalytics: !data.enableAnalytics,
									author: user?.uid,
								});

							form.setSubmitting(false);
							setSuccessAlert({
								shortLink: data.shortLink,
								toLink: data.toLink,
							});
							form.resetForm();
						})();
					}}
				>
					{({
						errors,
						touched,
						handleSubmit,
						isSubmitting,
						values,
						setFieldValue,
					}): ReactElement => {
						return (
							<Form onSubmit={handleSubmit}>
								<Form.Group controlId="shortlinkgroup">
									<Form.Label>Short Link:</Form.Label>
									<InputGroup className="mb-3">
										<InputGroup.Prepend>
											<InputGroup.Text>https://link.t485.org/</InputGroup.Text>
										</InputGroup.Prepend>
										<Field
											as={Form.Control}
											isInvalid={errors.shortLink && touched.shortLink}
											disabled={isSubmitting}
											placeholder={"my-short-link"}
											name={"shortLink"}
										/>
										<InputGroup.Append>
											<Button
												variant="outline-primary"
												disabled={isSubmitting}
												className={"rounded-right"}
												onClick={(): void => {
													generateId().then(key =>
														setFieldValue("shortLink", key)
													);
												}}
											>
												Random{" "}
											</Button>
										</InputGroup.Append>
										<Form.Control.Feedback type={"invalid"}>
											{" "}
											{errors.shortLink}
										</Form.Control.Feedback>
									</InputGroup>
								</Form.Group>

								<Form.Group controlId="shortlinkgroup">
									<Form.Label>Link to Redirect to:</Form.Label>
									<Field
										as={Form.Control}
										placeholder={"https://example.com"}
										name={"toLink"}
										isInvalid={errors.toLink && touched.toLink}
										disabled={isSubmitting}
									/>
									<Form.Control.Feedback type={"invalid"}>
										{errors.toLink}
									</Form.Control.Feedback>
								</Form.Group>
								<Form.Check
									custom
									type={"checkbox"}
									label={`Enable link analytics`}
									id={"linkAnalyticsCheckbox"}
									checked={values.enableAnalytics}
									onChange={(e: any): void =>
										setFieldValue("enableAnalytics", e.target.checked)
									}
								/>
								<Form.Check
									custom
									type={"checkbox"}
									label={`Enable link preview page (recommended)`}
									id={"linkPreviewCheckbox"}
									checked={values.enablePreview}
									onChange={(e: any): void =>
										setFieldValue("enablePreview", e.target.checked)
									}
								/>
								<Button
									type={"submit"}
									variant={"primary"}
									block
									className={"mt-3"}
								>
									{isSubmitting ? (
										<Spinner animation={"border"} as="span" />
									) : (
										"Create Link"
									)}
								</Button>
							</Form>
						);
					}}
				</Formik>
			</Loadable>
		</Layout>
	);
}
