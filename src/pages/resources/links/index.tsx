import React, { ReactElement } from "react";
import { Layout, SEO } from "../../../components/layout";
import { WindowLocation } from "@reach/router";
import { useFirebase } from "../../../firebase";
import AuthContext from "../../../context/AuthContext";
import { Link } from "gatsby";
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
import AuthGate from "../../../components/gates/AuthGate";
import firebaseType from "firebase";

export interface LinkData {
	author: string;
	clickAnalytics: boolean;
	created: firebaseType.firestore.Timestamp;
	disablePreview: boolean;
	disabled: boolean;
	to: string;
	version: number;
	clicks: number[];
}

const CopyLink = ({ link }: { link: string }): React.ReactElement => {
	const [show, setShow] = React.useState(false);
	const [timeoutID, setTimeoutID] = React.useState<NodeJS.Timeout>();
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
				copy to clipboard
			</Alert.Link>

			<Overlay show={show} target={linkRef.current} placement={"top"}>
				{(props): ReactElement => (
					<Tooltip id={`tooltip-short-link-copy`} {...props}>
						Copied!
					</Tooltip>
				)}
			</Overlay>
		</>
	);
};

export default function LinkShortenerPage(): ReactElement {
	const { user, loading, error, admin } = React.useContext(AuthContext);
	console.log(user, "ADMIN", admin, loading, error);
	const firebase = useFirebase();
	const [successAlert, setSuccessAlert] = React.useState(null);

	console.log(user);
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
	React.useEffect(() => {
		if (!firebase || !user) return;
		const makeAdmin = firebase.functions().httpsCallable("makeAdmin");
		makeAdmin({
			uid: user.uid,
		})
			.then(data => {
				console.log(data);
				// get the ID token to force a refresh, so that the setup status is immediately updated on all pages
				user.getIdTokenResult(true); //.then((data):void => console.log(data));
			})
			.catch(error => {
				console.log("ERROR", error);
			});
	}, [firebase, user]);

	return (
		<Layout>
			<SEO title="Link Shortener" />
			<AuthGate pagePath={"/resources/links"}>
				<h1>Troop 485 Link Shortener</h1>

				{admin && (
					<p>
						<b>Administrator Actions:</b>{" "}
						<Link to={"/resources/links/manage"}>Manage Links</Link>
					</p>
				)}
				<hr />

				{successAlert && (
					<Alert
						variant={"success"}
						dismissible
						onClose={(): void => setSuccessAlert(null)}
					>
						<b>Success!</b> The short link{" "}
						<b>https://link.t485.org/{successAlert.shortLink}</b> (
						<CopyLink
							link={"https://link.t485.org/" + successAlert.shortLink}
						/>
						) now redirects to <b>{successAlert.toLink}</b>.
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
								10000,
								"You may not redirect to a URL longer than 10000 characters."
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
									clickAnalytics: data.enableAnalytics,
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
			</AuthGate>
		</Layout>
	);
}
