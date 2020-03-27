import React from "react";

export default function useSessionStorage<T>(
	key: string,
	defaultValue: T = null
): [T, (newValue: T | ((prevState: T) => T)) => void] {
	let storageValue: string;
	if (typeof window !== "undefined") {
		storageValue = sessionStorage.getItem(key);
	} else {
		storageValue = "null";
	}
	if (typeof defaultValue === "undefined") {
		throw new Error(
			"useSessionStorage: undefined is not a valid value for session storage."
		);
	}
	const throwError = (): never => {
		console.log(
			"useSessionStorage debugging info:",
			key,
			defaultValue,
			storageValue
		);
		throw new Error(
			"useSessionStorage: undefined is not a valid value for session storage," +
				" and was not stored. This was likely caused by a corrupted sessionStorage. e.g. something else modified the same key in sessionStorage." +
				" " +
				key +
				" " +
				defaultValue +
				" " +
				storageValue
		);
	};
	const [state, setState] = React.useState(() =>
		storageValue === "undefined"
			? throwError()
			: JSON.parse(storageValue) || defaultValue
	);
	React.useEffect(() => {
		sessionStorage.setItem(key, JSON.stringify(state));
	}, [key, state]);
	return [state, setState];
}
