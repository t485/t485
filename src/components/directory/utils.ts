import PapaParse, { ParseResult } from "papaparse";
export interface Scout {
	firstName: string;
	lastName: string;
	patrol: string;
	email: string;
	cellPhone: string;
	homePhone: string;
	school: string;
}
export function fetchSpreadsheet(
	url: string,
	patrol: string
): Promise<
	{
		firstName: string;
		lastName: string;
		patrol: string;
		email: string;
	}[]
> {
	return new Promise((res, rej) => {
		try {
			PapaParse.parse(url, {
				download: true,
				header: true,
				skipEmptyLines: "greedy",
				complete: (
					results: ParseResult<{
						firstName: string;
						lastName: string;
						email: string;
					}>
				) => {
					if (results.errors.length > 0) {
						console.log("Fetch / parse spreadsheet error", results.errors);
					}
					res(
						results.data.slice(1).map(el => ({
							...el,
							patrol: patrol,
						}))
					);
				},
			});
		} catch (e) {
			rej(e);
		}
	});
}
