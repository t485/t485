import Loadable from "./LoadingGate";
import React from "react";

export default function AdminGate({
	loading,
	admin,
	children,
}: {
	loading: boolean;
	admin?: boolean;
	children: any;
}): React.ReactElement {
	return (
		<Loadable loading={loading}>
			{admin ? (
				children
			) : (
				<>
					<h1>Permission Denied</h1>
					<p>You do not have permission to view this page.</p>
				</>
			)}
		</Loadable>
	);
}
