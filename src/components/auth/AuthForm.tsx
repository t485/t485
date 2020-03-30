import React, { ReactElement } from "react";
import { Field as FormikField, Formik, FormikBag, FormikErrors } from "formik";
import { Button, Form } from "react-bootstrap";
import * as Yup from "yup";
import { StringSchema } from "yup";
import { NewPassword } from "./";

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
declare namespace Field {
	type ValidationMessage = string | false;

	interface FieldValidation {
		required?: ValidationMessage;
	}

	export interface Field {
		inputType: FieldInputType;
		/**
		 * Defaults to an empty string
		 */
		initialValue?: string;
		/**
		 * Defaults to a sensible default based on the field input type.
		 */
		schema?: Yup.StringSchema;
		/**
		 * A label for the input.
		 */
		label: string;
		/**
		 * A placeholder for the element. Set to "" to display an empty placeholder.
		 * If not defined, a sensible default will be shown.
		 */
		placeholder?: string;
		/**
		 * An object to customize validation and validation messages.
		 */
		validation?: FieldValidation;
		/**
		 * Help text to display.
		 */
		helpText?: string;
	}

	export type Any =
		| Field.Text
		| Field.Email
		| Field.Password
		| Field.NewPassword
		| Field.ConfirmPassword;

	export interface Text extends Field {
		inputType: FieldInputType.TEXT;
	}

	export interface Email extends Field {
		inputType: FieldInputType.EMAIL;
		validation: {
			email?: ValidationMessage;
		} & FieldValidation;
	}

	export interface Password extends Field {
		inputType: FieldInputType.PASSWORD;
	}

	export interface NewPassword extends Field {
		inputType: FieldInputType.NEW_PASSWORD;
		validation?: {
			minLength: ValidationMessage;
		} & FieldValidation;
	}

	export interface ConfirmPassword extends Field {
		inputType: FieldInputType.CONFIRM_PASSWORD;
		validation?: {
			matches: ValidationMessage;
		} & FieldValidation;
	}
}

type FormData = FieldTypes<Record<string, Field.Field>>;

interface AuthFormProps {
	fields: Record<string, Field.Field>;
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
	/**
	 * Content to go into the 'tray'. This is positioned between the last input field and the submit button.
	 * Typically, forgot password/create account links go here.
	 */
	tray?: ReactElement;

	/**
	 * Text that the button should show when the form is invalid. Defaults to `Fix Errors to ${buttonLabel}`
	 */
	invalidButtonLabel?: string;

	/**
	 * If set to true, the button will not be disabled even if there are errors.
	 * This is an advanced prop. For a sample implementation, see the forgotpassword page
	 * This is not recommended because it can be confusing to the user when they submit and nothing happens, which is what the case is when
	 * they submit and get the same errors.
	 * If's recommended you only enable this when a specific error has been triggered. To do that, store this value in a state, and only enable
	 * that state when the error is triggered. Of course, this isn't a perfect solution, because once that error has been triggered, the
	 * button will not be disabled for ALL errors. If this is a big issue, AuthForm may not be the ideal component for your use case.
	 * @default false
	 * @advanced
	 */
	dontDisableButtonWithError?: boolean;
	/**
	 * Help text to be displayed near the submit button.
	 */
	buttonHelpText?: string;
}

export default function AuthForm({
	fields,
	buttonLabel,
	onSubmit,
	tray,
	dontDisableButtonWithError,
	invalidButtonLabel,
	buttonHelpText,
}: AuthFormProps): ReactElement {
	type GetSchemaForOverload = {
		(
			field: Field.Text | Field.Email | Field.Password | Field.NewPassword
		): StringSchema;
		(field: Field.ConfirmPassword, linkedPasswordField: string): StringSchema;
	};
	const getSchemaFor: GetSchemaForOverload = (
		field: Field.Any,
		linkedPasswordField?: string
	): StringSchema => {
		const type = field.inputType;
		const validation = field.validation;
		let schema = Yup.string();
		if (validation?.required !== false) {
			// default is required
			schema = schema.required(
				validation?.required || "This field is required."
			);
		}

		if (
			type === FieldInputType.EMAIL &&
			(field as Field.Email)?.validation?.email !== false
		) {
			schema = schema.email(
				(field as Field.Email)?.validation?.email ||
					"Please enter a valid email."
			);
		}
		if (
			type === FieldInputType.NEW_PASSWORD &&
			(field as Field.NewPassword)?.validation?.minLength !== false
		) {
			schema = schema.min(
				6,
				(field as Field.NewPassword)?.validation?.minLength ||
					"Please enter a password of at least ${min} characters."
			);
		}
		if (
			type === FieldInputType.CONFIRM_PASSWORD &&
			(field as Field.ConfirmPassword)?.validation?.matches !== false
		) {
			schema = schema.oneOf(
				[Yup.ref(linkedPasswordField)],
				"The passwords you entered don't match."
			);
		}

		return schema;
	};
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
	const getPlaceholder = (field: Field.Field): string => {
		if (field.placeholder !== undefined) {
			return field.placeholder;
		}
		switch (field.inputType) {
			case FieldInputType.PASSWORD:
				return "Enter your password...";
			case FieldInputType.CONFIRM_PASSWORD:
				return "Confirm your new password...";
			case FieldInputType.NEW_PASSWORD:
				return "Enter a new password...";
			case FieldInputType.TEXT:
				return "";
			case FieldInputType.EMAIL:
				return "Enter your email...";
			default:
				return "";
		}
	};
	const schemaShape: { [K in keyof FormData]: StringSchema } = {};
	let firstPasswordFieldName: string | undefined;
	for (const name in fields) {
		if (
			fields[name].inputType === FieldInputType.NEW_PASSWORD &&
			!firstPasswordFieldName
		) {
			firstPasswordFieldName = name;
		}
		if (fields[name].inputType === FieldInputType.CONFIRM_PASSWORD) {
			if (!firstPasswordFieldName) {
				throw new Error(
					"AuthForm: The confirm password field cannot exist in a form without a new password field before the confirm password field."
				);
			}
			schemaShape[name] = getSchemaFor(
				fields[name] as Field.ConfirmPassword,
				firstPasswordFieldName
			);
		} else {
			schemaShape[name] = getSchemaFor(
				fields[name] as
					| Field.Text
					| Field.Email
					| Field.Password
					| Field.NewPassword
			);
		}
	}
	const schema = Yup.object().shape(schemaShape);
	return (
		<Formik
			validationSchema={schema}
			initialValues={((): { [K in keyof FormData]: "" } => {
				const initialValueObj: Partial<{ [K in keyof FormData]: "" }> = {};
				for (const key in fields) {
					initialValueObj[key] = "";
				}
				return initialValueObj;
			})()}
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
			}): ReactElement => {
				const hasErrors = (errors: FormikErrors<FormData>): boolean => {
					for (const key in errors) {
						// it's only considered an error if the user knows it's an error.
						if (errors[key] && touched[key]) return true;
					}
					return false;
				};
				return (
					<Form onSubmit={handleSubmit}>
						{Object.keys(fields).map((name, i) => {
							const field = fields[name];

							return (
								<Form.Group controlId={"authForm-Field-" + name} key={i}>
									<Form.Label>{field.label}</Form.Label>
									<FormikField
										as={
											field.inputType === FieldInputType.NEW_PASSWORD
												? NewPassword
												: Form.Control
										}
										name={name}
										type={getHTMLInputType(field.inputType)}
										isInvalid={errors[name] && touched[name]}
										disabled={isSubmitting}
										autoComplete={name}
										placeholder={getPlaceholder(field)}
										error={
											field.inputType === FieldInputType.NEW_PASSWORD
												? errors[name]
												: undefined
										}
									/>
									{field.inputType !== FieldInputType.NEW_PASSWORD && (
										<Form.Control.Feedback type="invalid">
											{errors[name]}
										</Form.Control.Feedback>
									)}
									<Form.Text>{field.helpText}</Form.Text>
								</Form.Group>
							);
						})}
						{tray}
						<Form.Text>{buttonHelpText}</Form.Text>
						<Button
							variant={"primary"}
							block
							type={"submit"}
							disabled={
								!!(
									isSubmitting ||
									(!dontDisableButtonWithError && hasErrors(errors))
								)
							}
						>
							{/* NOTE: button is intentionally clickable on submit. This avoids confusing users, and eliminates any chance of autofill bugs.
							 Before the onSubmit handler is called for AuthForm, AuthForm will validate. Additionally, clicking this buttom removes focus
							 from an input field, meaning errors will be shown, since the internal handler also calls onTouched each time.
							 */}
							{isSubmitting
								? "Loading..."
								: hasErrors(errors)
								? invalidButtonLabel || "Fix Errors to " + buttonLabel
								: buttonLabel}
						</Button>
					</Form>
				);
			}}
		</Formik>
	);
}
