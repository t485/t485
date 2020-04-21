import React, { ReactElement } from "react";
import EventLayout, { EventPageProps } from "./EventLayout";
import axios from "axios";
import Masonry from "react-masonry-component";
import { Button, Container, Spinner } from "react-bootstrap";

/**
 * TWO OPTIONS
 * embed google doc
 * pure HTML
 */
export default function EventPhotosPage(
	props: Partial<EventPageProps>
): ReactElement {
	// because reach router types doesn't understand path slugs.
	const { year, event, location } = props as EventPageProps;
	const [photos, setPhotos] = React.useState<string[]>([]);
	const [photosError, setPhotosError] = React.useState(false);
	const id = "hDwBRi7uMV5pJ9wM7";
	React.useEffect(() => {
		const getAlbum = async (id: string): Promise<any> => {
			try {
				const response = await axios.get(`https://photos-api.t485.org/${id}`);
				return response.data || [];
			} catch (e) {
				console.log(e);
				setPhotosError(true);
				return [];
			}
		};
		getAlbum(id).then(data => {
			setPhotos(data);
			console.log(data);
		});
	}, []);
	const masonryOptions = {
		transitionDuration: 0,
	};

	return (
		<EventLayout
			page={"photos"}
			location={location}
			event={event}
			year={year}
			noContainer
		>
			<Container className={"mt-5"}>
				<h1>Photos</h1>
				{/*<a href={`https://photos.app.goo.gl/${id}`} target={"_blank"} rel="noopener noreferrer" className={"link-no-style"}>*/}
				<Button
					variant={"primary"}
					block
					as={"a"}
					href={`https://photos.app.goo.gl/${id}`}
					target={"_blank"}
					rel="noopener noreferrer"
				>
					Open Album in Google Photos
				</Button>
				{/*</a>*/}
				{photos.length === 0 && !photosError && (
					<div className={"text-center p-5"}>
						<Spinner animation={"border"} />
						<p>Loading Preview...</p>
					</div>
				)}
				{photosError && <p>Preview not supported for this event.</p>}
			</Container>
			<div className={"p-5"}>
				{photos.length !== 0 && (
					<>
						<p className="text-muted">
							Note: For security reasons, videos don&apos;t play in the below
							preview.{" "}
							<a
								href={`https://photos.app.goo.gl/${id}`}
								target={"_blank"}
								rel="noopener noreferrer"
							>
								Open the album in google photos
							</a>{" "}
							to view videos and upload content.
						</p>
						<Masonry
							className={"my-gallery-class"} // default ''
							elementType={"div"} // default 'div'
							options={masonryOptions} // default {}
							disableImagesLoaded={false} // default false
							updateOnEachImageLoad={false} // default false and works only if disableImagesLoaded is false
						>
							{photos.map((src, i) => (
								<div className="image-element-class" key={i}>
									<img src={src} />
								</div>
							))}
						</Masonry>
					</>
				)}
			</div>
		</EventLayout>
	);
}
