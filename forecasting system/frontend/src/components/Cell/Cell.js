import { useEffect, useRef, useState } from 'react';
import { notify } from '../Notify/Notify';
import { ActionIcon } from '@mantine/core';
import { IconEdit, IconTrash, IconColumnInsertLeft, IconColumnInsertRight } from '@tabler/icons';
import { useContext } from 'react';
import { PageContext } from '../PageContext/PageContext';

function isOnOrBetweenDates(date, startingDate, endingDate) {
	return startingDate <= date && endingDate >= date;
}

export default function Cell({ dateKey, value, status, isToFocusOnEditing }) {
	const { tableData, dispatch } = useContext(PageContext);
	const [cellValue, setCellValue] = useState(value ? value : 'NaN');
	const [isEditing, setIsEditing] = useState(null);
	const inputRef = useRef(null);

	const isSelecting = tableData.activity.name === 'selecting';
	const textColor = tableData.errors.has(dateKey) ? 'text-red-500 font-bold ' : '';

	let inSelectStyle = '';
	let borderStyle = 'border border-slate-300 ';
	let showOptions = false;
	let leftOptionsDisplayStyle = 'hidden ';
	let rightOptionsDisplayStyle = 'hidden ';
	if (isSelecting) {
		inSelectStyle = 'cursor-pointer hover:border-2 hover:border-slate-500 ';

		const fromDateKey = tableData.activity.fromDateKey;
		const toDateKey = tableData.activity.toDateKey;
		const hasDateKey = fromDateKey === dateKey || toDateKey === dateKey;
		const hasDateKeys = fromDateKey && toDateKey;

		leftOptionsDisplayStyle = hasDateKeys && fromDateKey === dateKey ? '' : leftOptionsDisplayStyle;
		rightOptionsDisplayStyle = hasDateKeys && toDateKey === dateKey ? '' : rightOptionsDisplayStyle;

		if (hasDateKey) {
			showOptions = true;
			borderStyle = 'border-2 border-slate-500 ';
		}

		if (hasDateKeys && isOnOrBetweenDates(new Date(dateKey), new Date(fromDateKey), new Date(toDateKey)))
			borderStyle = 'border-2 border-slate-500 ';
	}

	const leftOptionsDivStyle =
		leftOptionsDisplayStyle + 'flex flex-col gap-0.5 absolute bottom-[-0.25rem] left-[-.7rem] z-50 ';
	const rightOptionsDivStyle =
		rightOptionsDisplayStyle + 'flex flex-col gap-0.5 absolute bottom-[-0.25rem] right-[-.7rem] z-50 ';
	const optionStyle = 'bg-slate-200 hover:bg-slate-400 border border-solid border-slate-400';

	const permanentCellStyle = 'border border-slate-300 border-solid bg-slate-50 text-center ';
	const editableCellStyle = 'relative border-solid text-center ' + borderStyle + textColor + inSelectStyle;
	const inputStyle =
		'w-[85%] focus:w-[100%] h-[1.8rem] m-auto flex items-center\
		text-center border-0 border-b-2 border-blue-500 focus:border-none ' +
		textColor;

	useEffect(() => {
		setCellValue(value);
	}, [value]);

	useEffect(() => {
		if (status === 'editing' && !isEditing) setIsEditing(true);
		else if (status === 'saving') {
			dispatch({ type: 'input', dateKey: dateKey, value: cellValue });
			setIsEditing(false);
		} else setIsEditing(false);
	}, [status]);

	useEffect(() => {
		if (isEditing && (status === 'standby' || isToFocusOnEditing)) {
			inputRef.current.focus();
			inputRef.current.select();
		}
	}, [isEditing, status, isToFocusOnEditing]);

	if (status === 'permanent') {
		return (
			<td className={permanentCellStyle} onDoubleClick={() => notify('warning', 'Original values cannot be edited.')}>
				{value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
			</td>
		);
	}

	if (isEditing) {
		return (
			<td className={editableCellStyle}>
				<input
					ref={inputRef}
					type="text"
					defaultValue={value}
					placeholder="NaN"
					className={inputStyle}
					onChange={(e) => setCellValue(e.target.value)}
					onBlur={() => {
						if (status === 'editing') return;
						setIsEditing(false);
						dispatch({ type: 'input', dateKey: dateKey, value: cellValue });
					}}
				/>
			</td>
		);
	} else {
		return (
			<td
				className={editableCellStyle}
				onClick={() => {
					if (isSelecting) dispatch({ type: 'select', selectedDateKey: dateKey });
				}}
				onDoubleClick={() => {
					if (tableData.activity.name === 'editing') notify('warning', 'Please finish editing first.');
					else if (status === 'standby') setIsEditing(true);
				}}
			>
				{showOptions && (
					<div className={leftOptionsDivStyle}>
						<ActionIcon
							size="xs"
							radius="lg"
							color="gray.9"
							className={optionStyle}
							onClick={(e) => {
								dispatch({
									type: 'insert',
									position: 'left',
								});
								e.stopPropagation();
							}}
						>
							<IconColumnInsertLeft size={18} />
						</ActionIcon>
						<ActionIcon
							size="xs"
							radius="lg"
							color="gray.9"
							className={optionStyle}
							onClick={(e) => {
								dispatch({
									type: 'delete',
								});
								e.stopPropagation();
							}}
						>
							<IconTrash size={18} />
						</ActionIcon>
					</div>
				)}
				{value ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : 'NaN'}
				{showOptions && (
					<div className={rightOptionsDivStyle}>
						<ActionIcon
							size="xs"
							radius="lg"
							color="gray.9"
							className={optionStyle}
							onClick={(e) => {
								dispatch({
									type: 'insert',
									position: 'right',
								});
								e.stopPropagation();
							}}
						>
							<IconColumnInsertRight size={18} />
						</ActionIcon>
						<ActionIcon
							size="xs"
							radius="lg"
							color="gray.9"
							className={optionStyle}
							onClick={(e) => {
								dispatch({
									type: 'edit',
								});
								e.stopPropagation();
							}}
						>
							<IconEdit size={18} />
						</ActionIcon>
					</div>
				)}
			</td>
		);
	}
}
