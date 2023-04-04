import { useState, useContext } from 'react';
import { Popover, Button, FileInput, Flex, Checkbox, Modal } from '@mantine/core';
import { IconUpload } from '@tabler/icons';
import { PageContext } from '../PageContext/PageContext';
import { notify } from '../Notify/Notify';
import instruction_img_1 from './instruction-1.png';
import instruction_img_2 from './instruction-2.png';
import instruction_img_3 from './instruction-3.png';

export default function UploadFile({ isInAdminPage, upload, setMonthPickerValue }) {
	const { tableData } = useContext(PageContext);
	const [csvFile, setCSVFile] = useState(null);
	const [isToAppendChecked, setIsToAppendChecked] = useState(true);
	const [openedModal, setOpenedModal] = useState(false);
	const [openedPopover, setOpenedPopover] = useState(false);

	const defaultButtonStyle = (theme) => ({
		root: {
			backgroundColor: 'rgb(100 116 139)',
			'&:hover': theme.fn.hover({
				backgroundColor: 'rgb(100 116 139)',
			}),
		},
	});

	return (
		<>
			<Modal
				size="lg"
				opened={openedModal}
				onClose={() => {
					setOpenedPopover((o) => !o);
					setOpenedModal((o) => !o);
				}}
				centered
				title="What to upload"
			>
				<ul className="ml-[-1.5em] text-sm">
					<li className="mb-1">Only a CSV file is supported.</li>
					<li className="mb-1">
						<span>
							Make sure the file contains "No. of New HIV Cases" as header. Other headers will be disregarded.
						</span>
						<img
							src={instruction_img_1}
							alt="Screenshot of a CSV file with multiple headers including one named
							 'No. of New HIV Cases', all with their valid values."
						/>
					</li>
					<li className="mb-1">Invalid values will be converted as NaN values.</li>
					<li className="mb-1">
						<span>
							If "Append to the table" is unchecked, make sure the file also contains "Date" as header. Note that only
							the{' '}
							<a href="https://tc39.es/ecma262/#sec-date-time-string-format" target="blank">
								ISO 180 format
							</a>{' '}
							is supported.
						</span>
						<img
							src={instruction_img_2}
							alt="Screenshot of a CSV file with headers 'No. of New HIV Cases' and 'Date', all with their valid values."
						/>
					</li>
					<li className="mb-1">
						<span>
							You may only fill in the first row of the "Date" column that has valid value in the "No. of New HIV Cases"
							column.
						</span>
						<img
							src={instruction_img_3}
							alt="Screenshot of a CSV file with headers 'No. of New HIV Cases' and 'Date', 
						but the first two rows in the 'No. of New HIV Cases' are invalid and only the third row in the 'Date' has a value."
						/>
					</li>
				</ul>
				<Checkbox
					label="Do not show this again."
					onChange={(event) => {
						if (event.currentTarget.checked) sessionStorage.setItem('hiv-fsystem_hideUpdateTableGuide', true);
					}}
					size="sm"
				/>
				<Button
					size="xs"
					styles={defaultButtonStyle}
					className="ml-auto block bg-slate-500 hover:bg-slate-500 rounded"
					onClick={() => {
						setOpenedModal((o) => !o);
						setOpenedPopover((o) => !o);
					}}
				>
					OK
				</Button>
			</Modal>
			<Popover
				width={300}
				trapFocus
				position="bottom"
				withArrow
				shadow="md"
				opened={openedPopover}
				onChange={setOpenedPopover}
			>
				<Popover.Target>
					<Button
						size="xs"
						styles={defaultButtonStyle}
						disabled={tableData.activity.name === 'editing'}
						onClick={() => {
							if (sessionStorage.getItem('hiv-fsystem_hideUpdateTableGuide')) setOpenedPopover((o) => !o);
							else {
								if (!openedPopover) setOpenedModal((o) => !o);
								else setOpenedPopover((o) => !o);
							}
						}}
					>
						Upload
					</Button>
				</Popover.Target>
				<Popover.Dropdown sx={(theme) => ({ background: theme.white })}>
					<Flex gap="xs" justify="left" direction="column">
						<Flex gap="xs" justify="center" align="center" direction="row">
							<FileInput
								size="xs"
								placeholder="CSV File"
								multiple={false}
								clearable={true}
								accept=".csv"
								value={csvFile}
								onChange={setCSVFile}
								icon={<IconUpload size={18} />}
								styles={(theme) => ({
									root: {
										width: '90%',
									},
								})}
							/>
							<Button
								size="xs"
								styles={(theme) => ({
									root: {
										padding: 0,
										width: '3em',
									},
								})}
								onClick={() => {
									onConfirmUpload();
									setOpenedPopover((o) => !o);
								}}
							>
								OK
							</Button>
						</Flex>
						<Checkbox
							label="Append to the table"
							size="xs"
							checked={isInAdminPage ? isToAppendChecked : true}
							onChange={(event) => setIsToAppendChecked(event.currentTarget.checked)}
							disabled={!isInAdminPage}
						/>
					</Flex>
				</Popover.Dropdown>
			</Popover>
		</>
	);

	function onConfirmUpload() {
		if (csvFile === null) return notify('error', 'No file is uploaded.');
		upload({ csvFile, isToAppendChecked, setMonthPickerValue });
	}
}
