interface AuthContinueState {
	/**
	 * The page that sent the user to the auth page.
	 */
	from: string;
	/**
	 * Whether to show a message letting the user know that they need to login to continue.
	 * If not provided, it will simply say 'login'
	 * @default false
	 */
	message?: boolean;
	/**
	 * Where the user should be navigated to next. If `true`, they will be returned to the same page as `from`.
	 * If a string is provided, they will ne navigated to that path. If `false` or undefined, the user will be sent
	 * to account home.
	 * @default true
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
	/**
	 * Mainly for debugging. Provides a list of every single auth processing page that the user has encountered. E.g. if the user
	 * is sent to login, and then clicks forgot password, and then clicks login again, the chain will be ["login", "forgotpassword", "login"]
	 */
	chain?: (
		| string
		| {
				name: string;
				data: object;
		  }
	)[];
}

interface AuthContinueStateWithChain extends AuthContinueState {
	chain: (
		| string
		| {
				name: string;
				data: object;
		  }
	)[];
}

export function addToChain(
	state: AuthContinueState,
	pageName: string
): AuthContinueStateWithChain;
export function addToChain(
	state: AuthContinueState,
	pageData: {
		name: string;
		data: object;
	}
): AuthContinueStateWithChain;
export function addToChain(
	state: AuthContinueState,
	data:
		| string
		| {
				name: string;
				data: object;
		  }
): AuthContinueStateWithChain {
	const modifiableState: AuthContinueStateWithChain = Object.assign(
		{
			chain: [],
		},
		state
	);
	if (modifiableState.chain[modifiableState.chain.length - 1] !== data) {
		modifiableState.chain.push(data);
	}
	return modifiableState;
}

// eslint-disable-next-line no-undef
export { AuthContinueState };
