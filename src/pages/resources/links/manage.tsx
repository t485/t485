import React, { ReactElement } from "react";
import { Layout, SEO } from "../../../components/layout";
import { WindowLocation } from "@reach/router";
import { navigate } from "gatsby";
import { AuthContinueState } from "../../../components/auth";
import { useFirebase } from "../../../firebase";
import AuthContext from "../../../context/AuthContext";
import { AdminGate } from "../../../components/gates";
import { Button, Form, ListGroup, Modal, Table } from "react-bootstrap";
import moment from "moment";

interface PageProps {
	location: WindowLocation;
}

interface LinkData {
	to: string;

	[Key: string]: any;
}

export default function LinkShortenerManagePage({
	location,
}: PageProps): ReactElement {
	const { user, loading, admin } = React.useContext(AuthContext);
	const [links, setLinks] = React.useState([]);
	const [editModal, setEditModal] = React.useState<null | {
		id: string;
		to: string;
		index: number;
	}>(null);
	const [infoModal, setInfoModal] = React.useState<null | {
		id: string;
		data: LinkData;
	}>(null);
	const [loadingIds, updateLoadingIds] = React.useReducer(
		(state: number[], action: { type: string; id: number }) => {
			switch (action.type) {
				case "add":
					return [...state, action.id];
				case "remove":
					return state.filter((id: number) => id !== action.id);
			}
		},
		[]
	);
	const firebase = useFirebase();
	if (!loading && !user) {
		navigate("/account/login", {
			state: {
				from: "/links/manage",
				message: true,
				return: true,
			} as AuthContinueState,
		});
	}
	React.useEffect(() => {
		if (!firebase || !admin || loading) {
			return;
		}

		firebase
			.firestore()
			.collection("linkshortener")
			.get()
			.then(function(querySnapshot) {
				const newLinks: {
					id: string;
					data: LinkData;
				}[] = [];
				querySnapshot.forEach(function(doc) {
					// doc.data() is never undefined for query doc snapshots
					// console.log(doc.id, " => ", doc.data());
					newLinks.push({
						id: doc.id,
						data: doc.data() as LinkData,
					});
				});
				setLinks(newLinks);
			});
	}, [firebase, admin, loading]);
	const colWidths = [2, 3, 3, 2, 2];
	return (
		<Layout location={location} admin={admin}>
			<SEO title="Manage Links" />
			<AdminGate loading={loading} admin={admin}>
				<h1>Manage Links</h1>
				<Table hover>
					<thead>
						<tr className={"d-flex"}>
							<th className={`col-${colWidths[0]}`}>Actions</th>
							<th className={`col-${colWidths[1]}`}>ID</th>
							<th className={`col-${colWidths[2]}`}>Target</th>
							<th className={`col-${colWidths[3]}`}>Created</th>
							<th className={`col-${colWidths[4]}`}>More</th>
						</tr>
					</thead>
					<tbody>
						{links.map((link, i) => {
							const disabled = loadingIds.indexOf(i) > -1;

							return (
								<tr
									key={link.id}
									className={
										"d-flex" + (link.data.disabled ? " text-muted mb-0" : "")
									}
								>
									<td className={`col-${colWidths[0]}`}>
										{disabled ? (
											<p className={"text-muted mb-0"}>
												{link.data.disabled ? "Enable" : "Disable"} | Edit
											</p>
										) : (
											<>
												<a
													onClick={(): void => {
														updateLoadingIds({ type: "add", id: i });
														const newState = !link.data.disabled;
														firebase
															.firestore()
															.collection("linkshortener")
															.doc(link.id)
															.update({
																disabled: newState,
															})
															.then(() => {
																setLinks(oldLinks => {
																	const clone = oldLinks.slice();
																	clone[i] = {
																		...link,
																		data: {
																			...link.data,
																			disabled: newState,
																		},
																	};
																	return clone;
																});
																console.log("DONE");
																updateLoadingIds({ type: "remove", id: i });
															});
													}}
												>
													{link.data.disabled ? "Enable" : "Disable"}
												</a>{" "}
												|{" "}
												<a
													onClick={(): void => {
														setEditModal({
															id: link.id,
															to: link.data.to,
															index: i,
														});
														console.log({
															id: link.id,
															to: link.data.to,
															index: i,
														});
													}}
												>
													Edit
												</a>
											</>
										)}
									</td>
									<td className={`col-${colWidths[1]}`}>
										{link.id} (
										<a
											onClick={(): Promise<void> =>
												navigator.clipboard.writeText(
													`https://link.t485.org/${link.id}`
												)
											}
										>
											copy link
										</a>
										)
									</td>
									<td className={`col-${colWidths[2]}`} title={link.data.to}>
										{link.data.to.substring(0, 5) === "https"
											? link.data.to.substring(8, 38)
											: link.data.to.substring(7, 37)}
										{link.data.to.length > 30 && "..."} (
										<a
											onClick={(): Promise<void> =>
												navigator.clipboard.writeText(link.data.to)
											}
										>
											copy
										</a>{" "}
										|{" "}
										<a
											href={link.data.to}
											target={"_blank"}
											rel={"noopener noreferrer"}
										>
											visit
										</a>
										)
									</td>
									<td className={`col-${colWidths[3]}`}>
										{moment(link.data.created.toDate()).format(
											"M/D/YY, h:mm a"
										)}
									</td>
									<td className={`col-${colWidths[4]}`}>
										<a onClick={(): void => setInfoModal(link)}>View More</a>
									</td>
								</tr>
							);
						})}
					</tbody>
				</Table>
				{/*{ JSON.stringify(links) }*/}
			</AdminGate>
			{/* Edit Modal */}
			<Modal show={!!editModal} onHide={(): void => setEditModal(null)}>
				<Modal.Header closeButton>
					<Modal.Title>link.t485.org/{editModal?.id}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<b>New URL: </b>
					<Form.Control
						value={editModal?.to || ""}
						type={"text"}
						onChange={(event): void => {
							const value = event.target.value;
							setEditModal(old => ({
								id: old.id,
								to: value,
								index: old.index,
							}));
						}}
					/>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={(): void => setEditModal(null)}>
						Cancel
					</Button>
					<Button
						variant="primary"
						onClick={(): void => {
							const index = editModal.index;
							// console.log(index, JSON.stringify(editModal.index))
							const to = editModal.to;
							updateLoadingIds({ type: "add", id: index });
							firebase
								.firestore()
								.collection("linkshortener")
								.doc(editModal.id)
								.update({
									to: editModal.to,
								})
								.then(() => {
									setLinks(oldLinks => {
										const clone = oldLinks.slice();
										// console.log(index, clone[index])
										clone[index] = {
											...clone[index],
											data: {
												...clone[index].data,
												to: to,
											},
										};
										return clone;
									});
									console.log("DONE");
									updateLoadingIds({ type: "remove", id: index });
								});
							setEditModal(null); // it will still be set to null by the time .then() is called.
						}}
					>
						Save Changes
					</Button>
				</Modal.Footer>
			</Modal>
			<Modal show={!!infoModal} onHide={(): void => setInfoModal(null)}>
				<Modal.Header closeButton>
					<Modal.Title>link.t485.org/{infoModal?.id}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<ListGroup variant="flush">
						{[
							{
								component: (
									<ListGroup.Item>
										<b>Key:</b> {infoModal?.id}
									</ListGroup.Item>
								),
								order: 0,
							},
							...Object.keys(infoModal?.data || {}).map(key => {
								const getFullKey = (id: string): string => {
									const fullKey = ({
										clickAnalytics: "Click Analytics",
										created: "Creation Date",
										to: "To",
										author: "Author",
										disablePreview: "Disable Preview",
										disabled: "Disabled",
										version: "Version",
										clicks: "Clicks",
									} as any)[key];
									return fullKey || id;
								};
								const getOrder = (key: string): number => {
									const order =
										[
											"to",
											"created",
											"author",
											"disabled",
											"clickAnalytics",
											"clicks",
											"disablePreview",
											"version",
										].indexOf(key) + 1;
									if (order !== 0) return order;
									return 100000;
								};
								const value = infoModal?.data[key];
								return {
									order: getOrder(key),
									component: (
										<ListGroup.Item>
											<b>{getFullKey(key)}:</b>{" "}
											{key === "created" ? (
												moment(value.toDate()).format("M/D/YY, h:mm a")
											) : key === "clicks" ? (
												<>
													<span>{value.length} Total</span>
													<ul>
														{" "}
														{value.map((click: number, id: number) => (
															<li key={id}>
																{moment(click).format("M/D/YY [at] h:mm:ss a")}
															</li>
														))}
													</ul>
												</>
											) : typeof value === "string" ? (
												value
											) : typeof value === "boolean" ? (
												value ? (
													<span className={"text-success"}>Yes</span>
												) : (
													<span className={"text-danger"}>No</span>
												)
											) : (
												JSON.stringify(value)
											)}
										</ListGroup.Item>
									),
								};
							}),
						]
							.sort((a, b) => a.order - b.order)
							.map((obj, i) => (
								<React.Fragment key={i}>{obj.component}</React.Fragment>
							))}
					</ListGroup>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={(): void => setInfoModal(null)}>
						Close
					</Button>
				</Modal.Footer>
			</Modal>
		</Layout>
	);
}
