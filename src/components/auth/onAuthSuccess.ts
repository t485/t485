import { AuthContinueState } from "./AuthContinueState";
import { navigate } from "gatsby-link";
import { AuthReturnState } from "./AuthReturnState";

export default function(
	state: AuthContinueState,
	fromPage: string
): Promise<void> {
	return navigate(
		state.return && typeof state.return === "string"
			? state.return
			: state.return === false
			? "/"
			: state.from,
		{
			state: {
				from: fromPage,
				state: state.state,
			} as AuthReturnState,
			replace: true,
		}
	);
}
