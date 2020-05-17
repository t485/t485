import React, { FormEvent, ReactElement, SyntheticEvent } from "react";
import { Form, OverlayTrigger, Popover } from "react-bootstrap";
import zxcvbn from "zxcvbn";

const NewPassword = ({
	value,
	onChange,
	name,
	error,
	...restProps
}: {
	value: string;
	onChange: (value: FormEvent) => void;
	name: string;
	/**
	 * Will be displayed only if invalid
	 */
	error: string;
} & React.HTMLAttributes<HTMLButtonElement>): ReactElement => {
	const feedback = zxcvbn(value, [
		"troop",
		"485",
		"t485",
		"hoc5",
		"scouting",
		"boy",
		"scouts",
		"95014",
		"cupertino",
		"correcthorsebatterystaple",
	]);
	const UpdatingPopoverBase = ({
		popper,
		children,
		id,
		...props
	}: {
		id: string;
		children: ReactElement | ReactElement[];
		popper: { scheduleUpdate: () => void };
	}): ReactElement => {
		React.useEffect(() => {
			popper.scheduleUpdate();
		}, [children, popper]);

		return (
			<Popover id={id} {...props}>
				{children}
			</Popover>
		);
	};
	const UpdatingPopover = React.forwardRef(UpdatingPopoverBase);

	return (
		<>
			<Form.Group>
				<OverlayTrigger
					flip={true}
					trigger="focus"
					placement="top-start"
					overlay={
						// React bootstrap injects the scheduleUpdate function, but it is not well defined in it's typings
						// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
						// @ts-ignore
						<UpdatingPopover id="password-strength-popover">
							<Popover.Title
								as="h3"
								className={`text-${
									[
										"muted",
										"danger",
										"danger",
										"warning",
										"warning",
										"success",
									][feedback.score + 1]
								}`}
							>
								Password Strength:{" "}
								{value.length < 6
									? "Too Short"
									: [
											"Loading...",
											"Very Weak",
											"Weak",
											"So-So",
											"Decent",
											"Strong",
									  ][feedback.score + 1]}
							</Popover.Title>

							{(value.length < 6 ||
								feedback.feedback.warning ||
								feedback.feedback.suggestions) && (
								<Popover.Content>
									{value.length < 6 && (
										<>
											<b>Passwords must be at least 6 characters</b>
											<br />
										</>
									)}
									{feedback.feedback.warning && (
										<>
											<b>{feedback.feedback.warning}</b>
											<br />
										</>
									)}

									{feedback.feedback.suggestions &&
										feedback.feedback.suggestions.length > 0 && (
											<>
												Suggestions: {feedback.feedback.suggestions.join(" ")}
											</>
										)}
								</Popover.Content>
							)}
						</UpdatingPopover>
						// )}
					}
				>
					<Form.Control
						placeholder="Enter a new password..."
						type="password"
						value={value}
						autoComplete="new-password"
						onChange={(e: SyntheticEvent): void => onChange(e)}
						name={name}
						{...restProps}
					/>
				</OverlayTrigger>

				<Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
			</Form.Group>
			{value !== "" && feedback.score > -1 && (
				<>
					{/*<p>*/}
					{/*  <b>Strength:</b>{" "}*/}
					{/*  <span*/}

					{/*  >*/}
					{/*    {*/}

					{/*  </span>*/}
					{/*</p>*/}
					{/*{feedback.feedback.warning !== "" && (*/}
					{/*  <p className="text-warning">*/}
					{/*    <b>Warning:</b> {feedback.feedback.warning}*/}
					{/*  </p>*/}
					{/*)}*/}
					{/*{feedback.feedback.suggestions && feedback.feedback.suggestions.length > 0 && (*/}
					{/*  <>*/}
					{/*    <b>Suggestions:</b>*/}
					{/*    <ul>*/}
					{/*      {feedback.feedback.suggestions.map((el, i) => (*/}
					{/*        <li key={i}>{el}</li>*/}
					{/*      ))}*/}
					{/*    </ul>*/}
					{/*  </>*/}
					{/*)}*/}
				</>
			)}
		</>
	);
};

export default NewPassword;
