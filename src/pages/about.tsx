import React, { ReactElement } from "react";
import { Layout, SEO } from "../components/layout";
import "../styles/about.scss";
import { Carousel } from "react-bootstrap";
import { graphql } from "gatsby";
import Image, { FluidObject } from "gatsby-image";
import { WindowLocation } from "@reach/router";

interface FluidImageWithName extends FluidObject {
	originalName: string;
}

interface QueryResult {
	slideImages: {
		edges: {
			node: {
				childImageSharp: {
					fluid: FluidImageWithName;
				};
			};
		}[];
	};
}

export default function AboutPage({
	data,
}: {
	data: QueryResult;
}): ReactElement {
	console.log(data);
	const images = data.slideImages.edges?.map(
		edge => edge.node.childImageSharp.fluid
	);
	console.log(images);

	return (
		<Layout empty className={"about-page"}>
			<SEO title={"About Us"} />
			<header>
				<div className={"hero-text text-shadow"}>
					<h1>About Us</h1>
					<p>We Are Troop 485</p>
				</div>
				<Carousel
					interval={
						6000 /*null = dont cycle  TODO: decide if this is best (add pause button?)*/
					}
				>
					{images.map((image, i) => (
						<Carousel.Item key={i}>
							<Image
								className={"d-block w-100"}
								fluid={image}
								imgStyle={{
									height: "50vh",
									width: "100vw",
									objectPosition: "center",
								}}
							/>
							{/*<Carousel.Caption>*/}
							{/*<h3 className={"text-shadow-heavy"}>About Us{imageCaptions[image.originalName]?.title}</h3>*/}
							{/*<p className={"text-shadow-heavy"}>Troop 485{imageCaptions[image.originalName]?.description}</p>*/}
							{/*</Carousel.Caption>*/}
						</Carousel.Item>
					))}
				</Carousel>
			</header>

			{/*<!-- Page Content -->*/}
			<section className="py-5">
				<div className="container">
					<h1 className="font-weight-light">
						About <strong>Our Troop</strong>
					</h1>
					<p className="lead">
						<b>TODO</b>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
						eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
						ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
						aliquip ex ea commodo consequat. Duis aute irure dolor in
						reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
						pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
						culpa qui officia deserunt mollit anim id est laborum.
					</p>
					<h1 className="font-weight-light mt-5">
						About the <strong>Boy Scouts of America</strong>
					</h1>
					<p className="lead">
						<b>TODO</b>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
						eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
						ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
						aliquip ex ea commodo consequat. Duis aute irure dolor in
						reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
						pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
						culpa qui officia deserunt mollit anim id est laborum.
					</p>
				</div>
			</section>
		</Layout>
	);
}
export const query = graphql`
	query {
		slideImages: allFile(
			filter: { relativePath: { glob: "about/slide-*.{jpg,jpeg,png,gif}" } }
			sort: { fields: name }
		) {
			edges {
				node {
					childImageSharp {
						fluid(maxWidth: 1920, quality: 75) {
							originalName
							...GatsbyImageSharpFluid_withWebp
						}
					}
				}
			}
		}
	}
`;
