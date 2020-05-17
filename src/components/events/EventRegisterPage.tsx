import React, { ReactElement } from "react";
import EventLayout, { EventPageProps } from "./EventLayout";
import AuthContext from "../../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { Formik } from "formik";
import { Form } from "react-bootstrap";

interface FieldProps {
	label: string;
	errors: object;
	helpText?: string;
	children: React.ReactNode;
}

const Field = ({
	label,
	errors,
	helpText,
	children,
}: FieldProps): ReactElement => {
	return (
		<Form.Group controlId={"formik-field-form-group-" + name}>
			<Form.Label>{label}</Form.Label>
			{children}

			<Form.Control.Feedback type="invalid">
				{errors[name]}
			</Form.Control.Feedback>

			<Form.Text>{helpText}</Form.Text>
		</Form.Group>
	);
};
export default function EventRegisterPage(
	props: Partial<EventPageProps>
): ReactElement {
	// because reach router types doesn't understand path slugs.
	const { year, event, location, data } = props as EventPageProps;
	const { user, loading, error } = React.useContext(AuthContext);
	return (
		<EventLayout
			page={"register"}
			event={event}
			location={location}
			year={year}
			data={data}
		>
			<h1>Register</h1>
			<p className={"text-muted"}>
				<FontAwesomeIcon icon={faInfoCircle} /> You are registering as{" "}
				<b>{user?.displayName}</b>. You may register for yourself and also any
				other people (e.g. parents or siblings) attending with you.
			</p>
			<Formik
				initialValues={{
					canAttend: true,
				}}
				onSubmit={(data, bag): void => {
					console.log(data);
				}}
			>
				{({
					handleSubmit,
					handleChange,
					handleBlur,
					errors,
					touched,
					values,
					isSubmitting,
					setFieldValue,
				}): ReactElement => (
					<Form onSubmit={handleSubmit}>
						<Form.Check
							type="checkbox"
							custom
							label={
								"I confirm that I will be able to attend and be on time. I understand that if I am suddenly unable to attend for some reason, it is my responsibility to contact the SIC."
							}
							id={"canAttend"}
							checked={values.canAttend}
							onChange={(event: { target: { checked: boolean } }): void =>
								setFieldValue("canAttend", event.target.checked)
							}
						/>
						<h3 className={"pt-4"}>Other Attendees</h3>
						<p>
							Please tell us how many family members and other attendees will be
							coming with you. If you have a sibling that is also in this troop,
							please only list the additional attendees, such as your parents,
							for one scout.
						</p>

						<p>Replace with number input.</p>
						<p>Will your parents be able to drive?</p>
						<p>How many seats?</p>
					</Form>
				)}
			</Formik>
		</EventLayout>
	);
}
