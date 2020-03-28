import React, { ReactElement } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
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
	<Layout pageName="index" transparentNavFooter card={false} background={false}>
		<SEO
			title="Home"
			keywords={[`Troop 485`, `Scouting`, `Boy Scouts`, `Cupertino`]}
		/>
		<Container className="text-center container index-page-container">
			<div>
				<h1>Troop 485</h1>
				<h3>Cupertino, California</h3>
				<Row className="cta-block">
					<Col md={2} lg={3} xl={4} className={"d-none d-md-block"}></Col>
					<Col sm={12} md={4} lg={3} xl={2} className={""}>
						<Button
							variant="outline-light"
							size="lg"
							className="d-none d-md-block"
							block
						>
							About Us
						</Button>
						<Button
							variant="light"
							size="lg"
							className="d-block d-md-none"
							block
						>
							About Us
						</Button>
					</Col>
					<Col
						sm={12}
						md={4}
						lg={3}
						xl={2}
						className={"mt-3 ml-0 ml-md-3 mt-md-0"}
					>
						<Button variant="primary" size="lg" className="" block>
							Join Today
						</Button>
					</Col>
					<Col md={2} lg={3} xl={4} className={"d-none d-md-block"}></Col>
				</Row>
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
		bgImage: file(relativePath: { eq: "index/bg_index2.JPG" }) {
			childImageSharp {
				fluid(maxWidth: 1920, quality: 100) {
					...GatsbyImageSharpFluid_withWebp
				}
			}
		}
	}
`;

export default IndexPage;
