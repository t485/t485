import React, { ReactElement } from "react";
import { Field, Formik, FormikBag } from "formik";
import { Button, Form } from "react-bootstrap";
import * as Yup from "yup";

export enum FieldInputType {
	TEXT = "text",
	EMAIL = "email",
	PASSWORD = "password",
	NEW_PASSWORD = "new_password",
	CONFIRM_PASSWORD = "confirm_password",
}

type FieldTypes<T extends Record<string, any>> = {
	[K in keyof T]: string;
};

interface Field {
	inputType: FieldInputType;
	/**
	 * Defaults to an empty string
	 */
	initialValue?: string;
	/**
	 * Defaults to a sensible default based on the field input type.
	 */
	schema?: Yup.StringSchema;
}

type FormData = FieldTypes<Record<string, Field>>;

interface AuthFormProps {
	fields: Record<string, Field>;
	/**
	 * A handler for when the function submits.
	 * @param values - An object containing one value for each key in the fields object provided
	 * @param formikBag - A set of functions used to control the form. See the formik docs for more info.
	 */
	onSubmit: (
		values: FormData,
		formikBag: FormikBag<FormData, FormData>
	) => void;
	/**
	 * The text that the button should have when the form is valid. When not valid, the button will render "Fix Errors to " concatenated with the value of this.
	 */
	buttonLabel: string;
}

export default function AuthForm({
	fields,
	buttonLabel,
	onSubmit,
}: AuthFormProps): ReactElement {
	const schema = Yup.object().shape({
		email: Yup.string()
			.email("The email you entered isn't valid.")
			.required("Please enter an email"),
	});
	const getHTMLInputType = (type: FieldInputType): string => {
		switch (type) {
			case FieldInputType.PASSWORD:
			case FieldInputType.CONFIRM_PASSWORD:
			case FieldInputType.NEW_PASSWORD:
				return "password";
			case FieldInputType.TEXT:
			case FieldInputType.EMAIL:
				return "text";
			default:
				return type;
		}
	};
	return (
		<Formik
			validationSchema={schema}
			initialValues={{
				email: "",
			}}
			onSubmit={onSubmit}
		>
			{({
				errors,
				touched,
				handleSubmit,
				isSubmitting,
			}: {
				errors: { [K in keyof FormData]: string };
				touched: { [K in keyof FormData]: boolean };
				handleSubmit: (e: React.FormEvent) => void;
				isSubmitting: boolean;
			}): ReactElement => (
				<Form onSubmit={handleSubmit}>
					{Object.keys(fields).map((name, i) => {
						const value = fields[name];

						return (
							<Form.Group controlId="authEmail" key={i}>
								<Form.Label>Email address</Form.Label>
								<Field
									as={Form.Control}
									name={name}
									type={getHTMLInputType(value.inputType)}
									isInvalid={errors[name] && touched[name]}
									disabled={isSubmitting}
								/>
								<Form.Control.Feedback type="invalid">
									{errors[name]}
								</Form.Control.Feedback>
							</Form.Group>
						);
					})}
					<Button
						variant={"primary"}
						block
						type={"submit"}
						disabled={!!(isSubmitting || errors.email)}
					>
						{(errors.email ? "Fix Errors to " : "") + buttonLabel}
					</Button>
				</Form>
			)}
		</Formik>
	);
}
