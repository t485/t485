import React from "react";
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import {
	Area,
	AreaChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import moment from "moment";

interface DayClicks {
	name: string;
	clicks: number;
}

export default function ClicksPerDayChart({
	clicks,
}: {
	clicks: number[];
}): React.ReactElement {
	if (!clicks) {
		return <p>Loading Chart</p>;
	}
	if (clicks.length === 0) {
		return <p>No Clicks yet!</p>;
	}

	const LONG_FORMAT = "dddd, MMMM D, YYYY";
	const FORMAT = "M/D/YY";
	// adding the current date as a "click" is a hack to get it to show 0 on the current day if there haven't been any clicks on that day.
	// at the end, we have to subtract one click from the last day on the array.
	const data: DayClicks[] = React.useMemo((): DayClicks[] => {
		const tempData = [...clicks, new Date().getTime()].reduce(
			(accData: DayClicks[], click) => {
				const day = moment(click).format(FORMAT);

				if (accData.length > 0 && accData[accData.length - 1].name === day) {
					const lastData = accData[accData.length - 1];

					return [
						...accData.slice(0, -1),
						{
							...lastData,
							clicks: lastData.clicks + 1,
						},
					];
				} else if (accData.length > 0) {
					const lastDayWithClicks = moment(
						accData[accData.length - 1].name,
						FORMAT
					);
					const diff = moment(day, FORMAT).diff(lastDayWithClicks, "days") - 1;
					return [
						...accData,
						...Array(diff)
							.fill(null)
							.map((v, i) => {
								const moment = lastDayWithClicks.add(i + 1, "days");
								return {
									name: moment.format(FORMAT),
									clicks: 0,
								};
							}),
						{
							name: day,
							clicks: 1,
						},
					];
				} else {
					return [
						{
							name: day,
							clicks: 1,
						},
					];
				}
			},
			[]
		);
		// account for the fake click that we added to force it to show 0 clicks if there aren't any clicks on the current day.
		tempData[tempData.length - 1].clicks--;
		return tempData;
	}, [clicks]);

	return (
		<ResponsiveContainer width={"99%"} height={300}>
			<AreaChart
				data={data}
				margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
			>
				<CartesianGrid strokeDasharray="3 3" />
				<XAxis dataKey="name" />
				<YAxis />
				<Tooltip
					labelFormatter={(longDay: string): string =>
						moment(longDay, FORMAT).format(LONG_FORMAT)
					}
				/>
				<Area
					type="monotone"
					dataKey="clicks"
					stroke="#8884d8"
					fill="#8884d8"
				/>
			</AreaChart>
		</ResponsiveContainer>
	);

	// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
	// @ts-ignore
}
