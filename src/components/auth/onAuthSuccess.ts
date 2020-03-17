import { AuthContinueState } from "./AuthContinueState";
import { navigate } from "gatsby-link";
import { AuthReturnState } from "./AuthReturnState";

export default function(state: AuthContinueState): Promise<void> {
	return navigate(
		state.return && typeof state.return === "string"
			? state.return
			: state.return === false
			? "/"
			: state.from,
		{
			state: {
				from: "challenge",
				state: state.state,
			} as AuthReturnState,
			replace: true,
		}
	);
}
