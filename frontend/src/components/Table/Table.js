import { useEffect, useContext } from 'react';
import { PageContext } from '../PageContext/PageContext';
import { notify } from '../Notify/Notify';
import Cell from '../Cell/Cell';

export default function Table() {
	const { tableData, dispatch, setChartsData } = useContext(PageContext);
	const isEditing = tableData.activity.name === 'editing';

	useEffect(() => {
		if (tableData.activity.name === 'saving') dispatch({ type: 'post-save' });
		else if (tableData.activity.name === 'saved')
			setChartsData((prevChartsData) => {
				return {
					...prevChartsData,
					actual: {
						name: 'Actual',
						series: tableData.savedSeries,
						color: '#1863D6',
					},
				};
			});
		else if (tableData.activity.name === 'not saved') notify('error', 'Cannot save with an invalid value.');
	}, [tableData.activity.name, tableData.savedSeries, setChartsData, dispatch]);

	return (
		<table className="w-[98%] mx-auto text-xs table-fixed border-collapse">
			<thead>{createTableHeaders()}</thead>
			<tbody>{createTableRows()}</tbody>
		</table>
	);

	function createTableHeaders() {
		const headers = [];
		const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
		const className = 'w-20 py-2 bg-slate-200 border border-solid border-slate-300';

		headers.push(<th key={'Yr/Mo'} className={className}></th>);
		months.map((month) =>
			headers.push(
				<th key={month} className={className}>
					{month}
				</th>
			)
		);

		return <tr>{headers}</tr>;
	}

	function createTableRows() {
		if (tableData.dateKeys.length === 0) return;

		const indexClassName = 'w-16 py-2 text-xs text-center bg-slate-200 border border-solid border-slate-300';
		const emptyCellClassName = 'border border-solid border-slate-300 bg-slate-50 text-center';

		const rows = [];
		const newRow = (firstValue) => [
			<td key={'row-' + firstValue} className={indexClassName}>
				{firstValue}
			</td>,
		];

		const startingDate = new Date(tableData.dateKeys[0]);
		let year = startingDate.getFullYear();
		let row = newRow(year++);

		row.push(...Array(startingDate.getMonth()).fill(<td className={emptyCellClassName}></td>));
		tableData.dateKeys.forEach((dateKey) => {
			if (row.length === 12 + 1) rows.push(<tr key={'row-' + year}>{row.splice(0, row.length)}</tr>);
			if (row.length === 0) row = newRow(year++);

			const lastDefaultDate = new Date(tableData.lastDefaultDateKey);
			const date = new Date(dateKey);
			const status = (() => {
				const activityName = tableData.activity.name;
				if (date <= lastDefaultDate) return 'permanent';
				if (activityName === 'editing') {
					const fromDate = new Date(tableData.activity.fromDateKey);
					const toDate = new Date(tableData.activity.toDateKey);

					if (date >= fromDate && date <= toDate) return 'editing';
				}
				if (activityName === 'selecting') return 'selecting';
				if (activityName === 'saving') return 'saving';
				return 'standby';
			})();

			row.push(
				<Cell
					key={dateKey}
					className="bg-slate-500"
					dateKey={dateKey}
					value={tableData.series[dateKey]}
					status={status}
					isToFocusOnEditing={isEditing && tableData.activity.fromDateKey === dateKey}
				></Cell>
			);
		});
		if (row.length > 0) rows.push(<tr key={'row-' + year}>{row}</tr>);

		return rows;
	}
}
