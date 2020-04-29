import React from "react";
import { Spinner } from "react-bootstrap";

export interface LoadingGateProps {
	loadingText?: string;
	loading: boolean;
	children: any;
}

export default function LoadingGate({
	loadingText,
	loading,
	children,
}: LoadableProps): React.ReactElement {
	if (loading) {
		return (
			<>
				<div className={"text-center pt-5"}>
					<Spinner animation={"border"} />
				</div>
				<p className={"text-center pt-5"}>{loadingText}</p>
			</>
		);
	} else {
		return children;
	}
}
