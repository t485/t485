import React, { ReactElement } from "react";
import { Layout, SEO } from "../../components/layout";
import { navigate } from "gatsby";
import { WindowLocation } from "reach__router";
import NewPassword from "../../components/auth/NewPassword";
import { AuthForm } from "../../components/auth";

export default function ActionPage({
	location,
}: {
	location: WindowLocation;
}): ReactElement {
	// React.useEffect(() => {
	//
	// 	//
	// }, [])
	console.log(location.state);
	return (
		<Layout>
			<SEO title="Account Action" />
			<h1>Choose a new password</h1>
			<AuthForm
				fields={{}}
				onSubmit={(d): void => {
					console.log(d);
				}}
				buttonLabel={"Label"}
			/>
		</Layout>
	);
}
