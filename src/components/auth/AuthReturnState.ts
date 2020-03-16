interface AuthReturnState {
	/**
	 * The page that sent the user back. Typically `login`.
	 */
	from: string;

	/**
	 * The data passed as part of the original request.
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	state?: any;
}

// eslint-disable-next-line no-undef
export { AuthReturnState };
