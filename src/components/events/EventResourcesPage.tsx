import React, { ReactElement } from "react";
import EventLayout, { EventPageProps } from "./EventLayout";
import { Button, Modal } from "react-bootstrap";
import ReactMarkdown from "react-markdown";

interface ResourceGroup {
	title: string;
	content: Resource[];
}

type IntrinsicResourceProperties = {
	name: string;
};
type Resource =
	| ({ type: "markdown"; content: string } & IntrinsicResourceProperties)
	| ({
			type: "googledoc";
			link: string;
			source: string;
	  } & IntrinsicResourceProperties)
	| ({ type: "link"; link: string } & IntrinsicResourceProperties);

const ResourceModal = ({
	resource,
	show,
	onClose,
}: {
	resource: Resource;
	show: boolean;
	onClose: () => void;
}): ReactElement => {
	let body;
	const LinkRenderer = (props: {
		href: string;
		children: React.ReactNode;
	}): ReactElement => (
		<a href={props.href} target="_blank" rel={"noopener noreferrer"}>
			{props.children}
		</a>
	);
	switch (resource.type) {
		case "googledoc":
			body = (
				<iframe
					src={resource.source}
					frameBorder={0}
					style={{
						height: "100%",
						minHeight: "70vh",
						width: "100%",
					}}
				/>
			);
			break;
		case "markdown":
			body = (
				<ReactMarkdown
					source={resource.content}
					escapeHtml={true}
					renderers={{
						link: LinkRenderer,
					}}
				/>
			);
			break;
	}

	return (
		<Modal show={show} onHide={onClose} size={"lg"}>
			<Modal.Header closeButton>
				<Modal.Title>{resource.name}</Modal.Title>
			</Modal.Header>
			<Modal.Body>{body}</Modal.Body>
			<Modal.Footer>
				{resource.type === "googledoc" && (
					<a className={"link-no-style"} href={resource.link}>
						<Button variant="primary" onClick={onClose}>
							Open in Google Docs
						</Button>
					</a>
				)}
				<Button variant="secondary" onClick={onClose}>
					Close
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default function EventResourcesPage(
	props: Partial<EventPageProps>
): ReactElement {
	// because reach router types doesn't understand path slugs.
	const { year, event, location } = props as EventPageProps;

	const [resourceModalOpen, setResourceModalOpen] = React.useState(false);
	const [resourceModalContent, setResourceModalContent] = React.useState<
		undefined | Resource
	>();

	const data: ResourceGroup[] = [
		{
			title: "",
			content: [
				{
					type: "link",
					name: "Google",
					link: "https://google.com",
				},
				{
					type: "googledoc",
					name: "Agenda",
					link:
						"https://docs.google.com/document/d/1A2EyhHnTKwqzlpCdVP7p_uqjIj_hL2jGLF8z72Epg7s/",
					source:
						"https://docs.google.com/document/d/1A2EyhHnTKwqzlpCdVP7p_uqjIj_hL2jGLF8z72Epg7s/mobilebasic",
				},
				{
					type: "markdown",
					name: "Markdown",
					content: `
# This should be an h1
### H3

[link](https://google.com)

[link](javascript:onthrow=alert;throw "hi")
				![Uh oh...]("onerror="alert('XSS'))
![Uh oh...](https://www.example.com/image.png"onload="alert('XSS'))

[XSS](javascript:prompt(document.cookie))
[XSS](j    a   v   a   s   c   r   i   p   t:prompt(document.cookie))
[XSS](data:text/html;base64,PHNjcmlwdD5hbGVydCgnWFNTJyk8L3NjcmlwdD4K)
[XSS](&#x6A&#x61&#x76&#x61&#x73&#x63&#x72&#x69&#x70&#x74&#x3A&#x61&#x6C&#x65&#x72&#x74&#x28&#x27&#x58&#x53&#x53&#x27&#x29)

					`,
				},
			],
		},
		{
			title: "Other Resources",
			content: [
				{
					type: "link",
					name: "One",
					link: "https://tomat.com",
				},
				{
					type: "link",
					name: "Two",
					link: "https://tomat.com",
				},
				{
					type: "link",
					name: "Three",
					link: "https://tomat.com",
				},
			],
		},
	];
	if (!resourceModalContent) {
		setResourceModalContent(data[0].content[1]);
	}
	return (
		<EventLayout
			page={"resources"}
			location={location}
			event={event}
			year={year}
		>
			<h1>Resources</h1>
			{data.map((group, i) => (
				<div key={i}>
					{group.title && <h3>{group.title}</h3>}
					<ul>
						{group.content.map((resource, j) => {
							let href, onClick;
							if (resource.type === "link") {
								href = resource.link;
							} else {
								onClick = (): void => {
									setResourceModalContent(resource);
									setResourceModalOpen(true);
								};
							}
							return (
								<li key={j}>
									{href && (
										<a
											href={href}
											target={"_blank"}
											rel={"noopener noreferrer"}
										>
											{resource.name}
										</a>
									)}
									{onClick && <a onClick={onClick}>{resource.name}</a>}
								</li>
							);
						})}
					</ul>
				</div>
			))}
			<ResourceModal
				resource={resourceModalContent}
				show={resourceModalOpen}
				onClose={(): void => setResourceModalOpen(false)}
			/>
		</EventLayout>
	);
}
