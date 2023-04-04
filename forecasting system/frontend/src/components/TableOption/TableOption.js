import { useRef, useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { Button, Divider, Input } from '@mantine/core';
import { PageContext } from '../PageContext/PageContext';
import { notify } from '../Notify/Notify';
import UpdateTable from '../UpdateTable/UpdateTable';
import GenerateForecast from '../GenerateForecast/GenerateForecast';
import UploadFile from '../UploadFile/UploadFile';
import TableInstruction from '../TableInstruction/TableInstruction';
import ModelSettings from '../ModelSettings/ModelSettings';

export default function TableOption({ mutate, upload }) {
	const location = useLocation();
	const { tableData, dispatch } = useContext(PageContext);
	const [monthPickerValue, setMonthPickerValue] = useState(new Date(tableData.dateKeys[0]));
	const inputNumRef = useRef(null);
	const isInAdminPage = location.pathname.indexOf('/admin') === 0;
	const isSelecting = tableData.activity.name === 'selecting';
	const isEditing = tableData.activity.name === 'editing';
	const isRecentlySaved = tableData.isRecentlySaved;
	const hasNewValue = tableData.lastDefaultDateKey !== tableData.dateKeys[tableData.dateKeys.length - 1];

	const defaultButtonStyle = (theme) => ({
		root: {
			backgroundColor: 'rgb(100 116 139)',
			'&:hover': theme.fn.hover({
				backgroundColor: 'rgb(100 116 139)',
			}),
		},
	});

	const selectButtonStyle = (theme) => ({
		root: {
			backgroundColor: isSelecting ? 'rgb(248 113 113)' : 'rgb(100 116 139)',
			'&:hover': theme.fn.hover({
				backgroundColor: isSelecting ? 'rgb(248 113 113)' : 'rgb(100 116 139)',
			}),
		},
	});

	return (
		<div className="w-[98%] m-auto mb-1 py-0.5 flex justify-between text-xs overflow-y-clip overflow-x-auto">
			<div className="flex gap-1">
				<Button size="xs" styles={selectButtonStyle} disabled={isEditing || !hasNewValue} onClick={handleOnSelect}>
					{isSelecting ? 'Cancel' : 'Select'}
				</Button>
				<Divider orientation="vertical" className="mx-1" />
				<UploadFile
					upload={upload}
					isInAdminPage={isInAdminPage}
					setMonthPickerValue={setMonthPickerValue}
					disabled={isSelecting}
				/>
				<Button size="xs" styles={defaultButtonStyle} onClick={handleOnAdd} disabled={isSelecting}>
					Add
				</Button>
				<Input
					size="xs"
					className="w-10"
					ref={inputNumRef}
					type="text"
					defaultValue={1}
					onKeyDown={handleOnEnterNumber}
				/>
				<span className="flex items-center">more cell(s)</span>
			</div>
			<div className="flex gap-1.5">
				<TableInstruction />

				<Button size="xs" styles={defaultButtonStyle} disabled={tableData.history.length === 0} onClick={handleOnUndo}>
					Undo
				</Button>
				<Button size="xs" styles={defaultButtonStyle} disabled={isRecentlySaved} onClick={handleOnSave}>
					Save
				</Button>
				{isInAdminPage ? (
					<UpdateTable mutate={mutate} monthPicker={[monthPickerValue, setMonthPickerValue]} />
				) : (
					<GenerateForecast mutate={mutate} />
				)}
				<ModelSettings isInAdminPage={isInAdminPage} />
			</div>
		</div>
	);

	function handleOnSelect() {
		if (isSelecting) dispatch({ type: 'cancel' });
		else dispatch({ type: 'select' });
	}

	function handleOnAdd() {
		try {
			const numOfCellsToAdd = parseInt(inputNumRef.current.value);
			if (!(!isNaN(numOfCellsToAdd) && numOfCellsToAdd > 0)) throw new Error('Please enter a positive integer number.');
			dispatch({ type: 'add', numOfCellsToAdd: numOfCellsToAdd });
		} catch (error) {
			notify('error', error.message);
		}
	}

	function handleOnEnterNumber(e) {
		if (e.keyCode === 13) handleOnAdd();
	}

	function handleOnSave() {
		dispatch({ type: 'save' });
	}

	function handleOnUndo() {
		dispatch({ type: 'undo' });
	}
}
