interface AuthContinueState {
	/**
	 * The page that sent the user to the auth page.
	 */
	from?: string;
	/**
	 * Whether to show a message letting the user know that they need to login to continue.
	 * @default false
	 */
	message?: boolean;
	/**
	 * Where the user should be navigated to next. If `true`, they will be returned to the same page as `from`.
	 * If a string is provided, they will ne navigated to that path. If `false` or undefined, the user will be sent
	 * to account home.
	 */
	return?: boolean | string;

	/**
	 * Data that will be returned to the initiating page.
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	state?: any;
	/**
	 *	Whether or not to reauthenticate the currently logged in user instead.
	 */
	isChallenge?: boolean;
}

// eslint-disable-next-line no-undef
export { AuthContinueState };
