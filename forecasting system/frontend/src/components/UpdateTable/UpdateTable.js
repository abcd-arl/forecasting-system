import { useContext } from 'react';
import { Button } from '@mantine/core';
import { MonthPickerInput } from '@mantine/dates';
import { PageContext } from '../PageContext/PageContext';
import { dateToDateKey } from '../Util/Util';

export default function UpdateTable({ mutate, monthPicker }) {
	const { tableData, modelSettings } = useContext(PageContext);
	const [monthPickerValue, setMonthPickerValue] = monthPicker;

	return (
		<div className="flex gap-1.5">
			<MonthPickerInput
				placeholder="Pick a starting date"
				value={monthPickerValue}
				onChange={setMonthPickerValue}
				mx="auto"
				miw={120}
				size="xs"
			/>
			<Button
				size="xs"
				variant="gradient"
				gradient={{ from: '#D3B1C2', to: '#88B2CC' }}
				disabled={monthPickerValue === ''}
				onClick={() => {
					mutate({
						series: tableData.savedSeries,
						startingDateKey: dateToDateKey(monthPickerValue),
						settings: modelSettings,
					});
				}}
			>
				Update Table
			</Button>
		</div>
	);
}
