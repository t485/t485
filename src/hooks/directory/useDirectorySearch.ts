import { useEffect, useMemo, useState } from "react";
import searchQueryParser from "search-query-parser";
import Fuse from "fuse.js";
import { Scout } from "../../components/directory/utils";
const weightedKeys = [
	{
		name: "firstName",
		weight: 100,
	},
	{
		name: "lastName",
		weight: 80,
	},
	{
		name: "email",
		weight: 40,
	},
	{
		name: "patrol",
		weight: 40,
	},
	{
		name: "school",
		weight: 10,
	},
];
const fuseOptions = {
	isCaseSensitive: false,
	shouldSort: true,
	threshold: 0.4,
	keys: weightedKeys,
};

export default function useDirectorySearchResults({
	query,
	data,
}: {
	query: string;
	data: Scout[];
}): Scout[] {
	const fuse = useMemo(() => new Fuse(data, fuseOptions), [data]);

	const [results, setResults] = useState([]);

	useEffect(() => {
		// build query
		const keywords = weightedKeys.map(wk => wk.name);
		const queryParserResult = searchQueryParser.parse(query.trim(), {
			keywords: keywords,
			alwaysArray: true,
			offsets: false,
			tokenize: true,
		});
		let searchResults;
		if (Array.isArray(queryParserResult)) {
			searchResults = fuse.search(query.trim()).map(r => r.item);
		} else {
			const parsedQuery: Record<string, string[]> = {
				...keywords.reduce((acc, kw) => ({ ...acc, [kw]: [] }), {}),
				text: [],
				...queryParserResult,
			} as any;
			const fuseQuery = {
				$and: [
					...keywords
						.map(keyword =>
							parsedQuery[keyword].map((query: string) => ({
								[keyword]: query,
							}))
						)
						.flat(),
					...parsedQuery.text.map(textToken => ({
						$or: keywords.map(keyword => ({ [keyword]: textToken })),
					})),
				],
			};
			searchResults = fuse.search(fuseQuery).map(r => r.item);
		}

		if (query.trim() == "" && searchResults.length == 0) {
			searchResults = data;
		}
		setResults(searchResults);
	}, [query, data]);

	return results;
}
