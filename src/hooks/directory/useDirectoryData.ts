import React, { useEffect, useState } from "react";
import { fetchSpreadsheet, Scout } from "../../components/directory/utils";
import AuthContext from "../../context/AuthContext";
import { useFirebase } from "../../firebase";

export default function useDirectoryData(): Scout[] {
	const [data, setData] = useState([]);
	const { user } = React.useContext(AuthContext);
	const firebase = useFirebase();

	useEffect(() => {
		if (!user || !firebase) {
			return;
		}
		(async (): Promise<void> => {
			const spreadsheetIdsSnapshot = await firebase
				.firestore()
				.collection("keys")
				.doc("spreadsheetIds")
				.get();
			const spreadsheetId = spreadsheetIdsSnapshot.data().directory;
			const gids: {
				dragons: string;
				serpents: string;
				hawks: string;
				wildcats: string;
				cacti: string;
				blobfish: string;
			} = spreadsheetIdsSnapshot.data().directoryGids;

			const sheetsData = await Promise.all(
				Object.keys(gids).map((patrol: keyof typeof gids) => {
					const patrolGid = gids[patrol];
					return fetchSpreadsheet(
						`https://docs.google.com/spreadsheets/d/e/${spreadsheetId}/pub?output=csv&gid=${patrolGid}`,
						patrol
					);
				})
			);
			console.log(sheetsData);
			const directoryData = sheetsData.flat().sort((a, b) => {
				return (
					a.lastName.toLowerCase().localeCompare(b.lastName.toLowerCase()) ||
					a.firstName.toLowerCase().localeCompare(b.firstName.toLowerCase())
				);
			});

			// TODO transform into class?

			setData(directoryData);
		})();
	}, [user, firebase]);

	return data;
}
