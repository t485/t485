import React, { ReactElement } from "react";

import { Layout, SEO } from "../../components/layout";
import { addToChain, AuthContinueState } from "../../components/auth";
import { Link } from "gatsby";
import { WindowLocation } from "@reach/router";

const GetAnAccountPage = ({
	location,
}: {
	location: WindowLocation & { state: AuthContinueState };
}): ReactElement => {
	const state = location.state && addToChain(location.state, "login");

	return (
		<Layout location={location}>
			<SEO title="How to get an account" />
			<h1>Getting a t485.org Account</h1>
			<p>
				If you are a member of Troop 485, you can create an account by{" "}
				<a href="mailto:webmaster@t485.org?subject=T485%20Account%20Creation%20Link">
					emailing the webmaster
				</a>{" "}
				for an account creation link. If you are interested in becoming a member
				of troop 485, <Link to={"/new-scouts"}>join the troop first</Link>, and
				you will get an account as part of the joining process.
			</p>
			<p>
				Note: If you already have an account, you can{" "}
				<Link to={"/account/login"} state={state}>
					login instead
				</Link>
				.
			</p>
		</Layout>
	);
};

export default GetAnAccountPage;
