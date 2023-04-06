import { useState, useRef, useEffect } from 'react';
import { MonthPickerInput } from '@mantine/dates';
import { IconCalendarEvent } from '@tabler/icons';
import { getDateKeysBetween, dateToDateKey, dateToString } from '../Util/Util';
import LineChart from '../LineChart/LineChart';

export default function LineChartRanged({ title, dataset }) {
	const dateKeys = Object.keys(dataset.series).sort((a, b) => new Date(a) - new Date(b));
	const dateRangeDefaultValue = useRef(getDateRangeValue(dateKeys));
	const [dateRangeValue, setDateRangeValue] = useState(dateRangeDefaultValue.current);
	const [minDate, maxDate] = [new Date(dateKeys[0]), new Date(dateKeys[dateKeys.length - 1])];
	const series = {};

	const currentFromDateKey = dateRangeValue[0]
		? dateToDateKey(dateRangeValue[0])
		: dateToDateKey(dateRangeDefaultValue.current[0]);
	const currentToDateKey = dateRangeValue[1]
		? dateToDateKey(dateRangeValue[1])
		: dateToDateKey(dateRangeDefaultValue.current[1]);

	getDateKeysBetween(currentFromDateKey, currentToDateKey).forEach(
		(dateKey) => (series[dateKey] = dataset.series[dateKey])
	);

	const lineChartDataset = {
		name: 'Actual Cases',
		series: series,
		color: '#1863D6',
	};

	useEffect(() => {
		dateRangeDefaultValue.current = getDateRangeValue(dateKeys);
	}, [dateKeys]);

	return (
		<>
			<LineChart title={finalTitle()} datasets={[lineChartDataset]} pointRadius={2} />
			<MonthPickerInput
				type="range"
				size="xs"
				icon={<IconCalendarEvent size={18} />}
				maxDate={maxDate}
				minDate={minDate}
				label="Pick dates range"
				defaultValue={dateRangeDefaultValue.current}
				value={dateRangeValue}
				onChange={setDateRangeValue}
				className="w-[65%] sm:w-[45%] md:w-[270px]"
			/>
		</>
	);

	function finalTitle() {
		const finalFromDate = dateRangeValue[0] ? dateRangeValue[0] : dateRangeDefaultValue.current[0];
		const finalToDate = dateRangeValue[1] ? dateRangeValue[1] : dateRangeDefaultValue.current[1];
		return title + ' from ' + dateToString(finalFromDate) + ' to ' + dateToString(finalToDate);
	}
}

function getDateRangeValue(dateKeys) {
	const dateKeysLen = dateKeys.length;
	const numMonthsInAYear = 12;
	if (dateKeysLen < numMonthsInAYear) return [new Date(dateKeys[0]), new Date(dateKeys)];
	return [new Date(dateKeys[dateKeysLen - numMonthsInAYear]), new Date(dateKeys[dateKeysLen - 1])];
}
