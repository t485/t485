import LoadingGate from "./LoadingGate";
import React from "react";
import AuthContext from "../../context/AuthContext";

export default function AdminGate({
	children,
}: {
	children: any;
}): React.ReactElement {
	const { user, admin, loading } = React.useContext(AuthContext);

	return (
		<LoadingGate loading={loading}>
			{admin ? (
				children
			) : (
				<>
					<h1>Permission Denied</h1>
					<p>You do not have permission to view this page.</p>
				</>
			)}
		</LoadingGate>
	);
}
