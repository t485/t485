import React, {
	ReactElement,
	RefObject,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import PapaParse, { ParseResult } from "papaparse";
import { Layout, SEO } from "../components/layout";
import { useFirebase } from "../firebase";
import AuthContext from "../context/AuthContext";
import searchQueryParser from "search-query-parser";
import Fuse from "fuse.js";
import {
	Col,
	FormControl,
	ListGroup,
	ListGroupItem,
	Row,
} from "react-bootstrap";
import AuthGate from "../components/gates/AuthGate";
import { fetchSpreadsheet, Scout } from "../components/directory/utils";
import useDirectorySearchResults from "../hooks/directory/useDirectorySearch";
import useDirectoryData from "../hooks/directory/useDirectoryData";

/**
 * Returns whether or not the given element is completely visible within its container.
 * @param el - The element to check
 * @param container - The parent
 */
const isVisible = (el: HTMLElement, container: HTMLElement): boolean => {
	const { bottom, top } = el.getBoundingClientRect();
	const containerRect = container.getBoundingClientRect();

	return top > containerRect.top && bottom < containerRect.bottom;
};
const scrollRefIntoView = (
	ref: RefObject<HTMLElement>,
	parentRef: RefObject<HTMLElement>,
	block: "start" | "center" | "end"
): void => {
	if (
		ref?.current &&
		parentRef?.current &&
		!isVisible(ref.current, parentRef.current)
	) {
		ref.current.scrollIntoView({
			block: block,
		});
	}
	ref.current.focus();
};
const getId = (scout: Scout): string =>
	scout.firstName + scout.lastName + scout.patrol + scout.email;
export default function DirectoryPage(): ReactElement {
	const data = useDirectoryData();

	const [search, setSearch] = useState("");
	const results = useDirectorySearchResults({
		query: search,
		data: data,
	});

	const [active, setActive] = useState("");
	const [activeScout, activeIndex] = useMemo(() => {
		// The active scout will always exist, but activeIndex refers to the index in the results array, so it might be -1
		// if the displayed entry is no longer in the search results.
		const activeScout = data.find(scout => getId(scout) === active);
		const activeIndex = results.findIndex(scout => getId(scout) === active);
		return [activeScout, activeIndex];
	}, [active, data]);
	useEffect(() => {
		const handler = (): void => {
			if (window.location.hash) {
				setActive(atob(decodeURIComponent(window.location.hash.substring(1))));
			}
		};
		window.addEventListener("hashchange", handler);
		handler();
		return (): void => {
			window.removeEventListener("hashchange", handler);
		};
	}, []);
	useEffect(() => {
		if (active != decodeURIComponent(window.location.hash.substring(1))) {
			window.location.hash = encodeURIComponent(btoa(active));
		}
	}, [active]);

	const searchResultContainerRef = useRef();
	const searchResultRefs = useMemo(
		() =>
			Array(results.length)
				.fill(null)
				.map(() => React.createRef<ListGroupItem<"a"> & HTMLAnchorElement>()),
		[results.length]
	);

	const handleKeyDown = useCallback(
		e => {
			const shouldGoDown =
				e.key == "ArrowDown" || (e.key == "Enter" && !e.shiftKey);
			const shouldGoUp = e.key == "ArrowUp" || (e.key == "Enter" && e.shiftKey);
			if (
				shouldGoDown &&
				activeIndex != -1 &&
				activeIndex < results.length - 1
			) {
				setActive(getId(results[activeIndex + 1]));
				scrollRefIntoView(
					searchResultRefs[activeIndex + 1],
					searchResultContainerRef,
					"end"
				);
				e.preventDefault();
			}
			if (shouldGoUp && activeIndex > 0) {
				setActive(getId(results[activeIndex - 1]));
				scrollRefIntoView(
					searchResultRefs[activeIndex - 1],
					searchResultContainerRef,
					"start"
				);
				e.preventDefault();
			}
		},
		[
			searchResultContainerRef,
			searchResultRefs,
			results,
			activeIndex,
			setActive,
		]
	);

	return (
		<Layout>
			<SEO title="Directory" />
			<AuthGate pagePath={"/directory"}>
				<h1>Directory</h1>
				<Row>
					<Col sm={12} md={activeScout ? 4 : 12}>
						<form
							onSubmit={(e): void => {
								if (results.length > 0) {
									scrollRefIntoView(
										searchResultRefs[0],
										searchResultContainerRef,
										"end"
									);
									setActive(getId(results[0]));
								}
								e.preventDefault();
							}}
						>
							<FormControl
								placeholder={"Search by name, email, or patrol..."}
								value={search}
								onChange={(e): void => setSearch(e.target.value)}
							/>
						</form>
						{/*<p className={"my-2"}>*/}
						{/*	<a>Advanced Search</a>*/}
						{/*</p>*/}
						<hr />
						{data.length === 0 && <p>Loading Data...</p>}
						{data.length !== 0 && search != "" && results.length === 0 && (
							<p>No Results</p>
						)}
						<ListGroup
							style={{
								height: "50vh",
								overflowY: "auto",
							}}
							ref={searchResultContainerRef}
						>
							{results.map((scout, i) => (
								<ListGroup.Item
									action
									active={getId(scout) == active}
									key={getId(scout)}
									onKeyDown={handleKeyDown}
									onClick={(): void => setActive(getId(scout))}
									ref={searchResultRefs[i]}
								>
									<h5>
										{scout.firstName} {scout.lastName}
									</h5>
									<small>
										{scout.patrol[0].toUpperCase() +
											scout.patrol.substring(1).toLowerCase()}
									</small>
								</ListGroup.Item>
							))}
						</ListGroup>
					</Col>

					{activeScout && (
						<Col sm={12} md={8}>
							<h3>{activeScout.firstName + " " + activeScout.lastName}</h3>

							<p>
								<b>
									<a
										onClick={(): void => {
											setSearch(
												"patrol:" +
													activeScout.patrol[0] +
													activeScout.patrol.substring(1).toLowerCase()
											);
										}}
									>
										{activeScout.patrol[0].toUpperCase() +
											activeScout.patrol.substring(1).toLowerCase()}
									</a>
								</b>
							</p>
							<Row>
								<Col sm={6}>
									<p>
										<b>Email</b>
										<br />
										<a target={"_blank"} href={"mailto:" + activeScout.email}>
											{activeScout.email}
										</a>
									</p>
								</Col>
								<Col sm={6}>
									<p>
										<b>Cell Phone</b>
										<br />
										<a href={"tel:" + activeScout.cellPhone}>
											{activeScout.cellPhone}
										</a>
									</p>
								</Col>
								<Col sm={6}>
									<p>
										<b>School</b>
										<br />
										<span>{activeScout.school}</span>
									</p>
								</Col>
								<Col sm={6}>
									<p>
										<b>Home Phone</b>
										<br />
										<a href={"tel:" + activeScout.homePhone}>
											{activeScout.homePhone}
										</a>
									</p>
								</Col>
							</Row>
						</Col>
					)}
				</Row>
			</AuthGate>
		</Layout>
	);
}
