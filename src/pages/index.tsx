import React, { ReactElement } from "react";
import { Button, Container } from "react-bootstrap";
import Layout from "../components/layout/Layout";
import SEO from "../components/layout/seo";
import "../styles/index.scss";
import { graphql } from "gatsby";
import Img, { FluidObject } from "gatsby-image";

interface GraphQLQueryResult {
	bgImage: {
		childImageSharp: {
			fluid: FluidObject;
		};
	};
}

const IndexPage = ({ data }: { data: GraphQLQueryResult }): ReactElement => (
	<Layout
		pageName="index"
		transparentNavFooter
		card={false}
		background={false}
	>
		<SEO
			title="Home"
			keywords={[`Troop 485`, `Scouting`, `Boy Scouts`, `Cupertino`]}
		/>
		<Container className="text-center container index-page-container">
			<div>
				<h1>Troop 485</h1>
				<h3>Cupertino, California</h3>
				<div className="text-center cta-block">
					<Button variant="outline-light" size="lg" className="cta">
						About Us
					</Button>
					<Button variant="primary" size="lg" className="cta">
						Join Today
					</Button>
				</div>
			</div>
			<div className="absolute bottom-0 left-0 right-0 top-0 -z-10 overflow-hidden background-image">
				<Img
					fluid={data.bgImage.childImageSharp.fluid}
					className="h-screen"
					style={{ minHeight: "800px" }}
				/>
			</div>
		</Container>
	</Layout>
);

export const query = graphql`
	query {
		bgImage: file(relativePath: { eq: "bg_index.jpg" }) {
			childImageSharp {
				fluid(maxWidth: 1920) {
					...GatsbyImageSharpFluid_withWebp
				}
			}
		}
	}
`;

export default IndexPage;
