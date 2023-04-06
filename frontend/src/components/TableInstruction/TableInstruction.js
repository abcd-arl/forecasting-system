import { useState } from 'react';
import { Modal, Button } from '@mantine/core';
import { IconQuestionMark } from '@tabler/icons';
import add_nan_img from './add_nan.png';
import add_invalid_img from './add_invalid.png';
import edit_img from './edit.png';
import select_img from './select.png';
import select_edit_img from './select_edit.png';
import select_insert_img from './select_insert.png';

export default function TableInstruction() {
	const [opened, setOpened] = useState(false);

	return (
		<>
			<Modal size="lg" opened={opened} centered onClose={() => setOpened(false)} title="Table Directions">
				<ol className="ml-[-1.5em] list-decimal text-sm">
					<li>
						<p>
							Click <b>Add</b> to create new cells. You may provide the number of cells to create in the input box.
						</p>
					</li>
					<li>
						<p>
							Click <b>Upload</b> to upload a CSV file. Instructions are displayed upon first click.
						</p>
					</li>
					<li>
						<p>
							Click <b>Save</b> to save your changes. An empty cell is converted to a NaN value, while having an invalid
							value will prevent you from saving. When saved successfully, charts and date ranges will adjust
							accordingly.
						</p>
						<div>
							<img src={add_nan_img} alt="Screenshot of the table with a NaN value." />
							<img src={add_invalid_img} alt="Screenshot of the table with an invalid value." />
						</div>
					</li>
					<li>
						<p>
							Click <b>Undo</b> to undo your changes.
						</p>
					</li>
					<li>
						<p>
							Click <b>Select</b> to select added cells. Click one cell to initialize the starting cell, and click
							another one to set the ending cell. The <b>Select</b> button will turn to <b>Cancel</b> when selecting,
							click this to stop selecting.
						</p>
						<div>
							<img src={select_img} alt="Screenshot of the table while selecting." />
						</div>
						<p>There are different ways to adjust your selection after choosing the ending cell:</p>
						<ul className="list-disc">
							<li>
								<p>Click any cell within your selection to shorten.</p>
							</li>
							<li>
								<p>
									Click any cell outside your selection to lengthen. The starting and ending would adjust accordingly.
								</p>
							</li>
							<li>
								<p>
									To manually adjust the starting or ending cell, click again either of the cell and choose your next
									starting or ending cell.
								</p>
							</li>
						</ul>
					</li>
					<li>
						<p>
							When cells are selected, you may choose to delete or edit them. You may also insert new cells, left or
							right, according to the number of cells selected.
						</p>
						<div>
							<img src={select_edit_img} alt="Screenshot of the table with cells being edited." />
							<img src={select_insert_img} alt="Screenshot of the table after insert." />
						</div>
					</li>
					<li>
						<p>
							To only edit one added cell, double click the cell to start editing and remove from focus when done. You
							cannot edit any of the original values.
						</p>
						<div>
							<img src={edit_img} alt="Screenshot of the table with a cell being edited." />
						</div>
					</li>
					<li>
						<p>Click the setting icon to make changes on how your model will be trained.</p>
					</li>
					<li>
						<p>
							Click <b>Generate Forecast</b> to generate new forecasts with the current saved values. Note that the
							number of forecasts will always have the next twelve (12) months from the last date. When recent values
							are dropped, the number of forecasts will adjust accordingly.
						</p>
					</li>
					<li>
						<p>
							If you are the administrator, Clicking the <b>Update Table</b> will generate a new default model. Changes
							on the table will be the new uneditable original values, and changes on the setting will be the new
							default configurations.
						</p>
					</li>
				</ol>
			</Modal>
			<Button size="xs" color="blue" variant="light" className="px-1" onClick={() => setOpened(true)}>
				<IconQuestionMark size={18} />
			</Button>
		</>
	);
}
