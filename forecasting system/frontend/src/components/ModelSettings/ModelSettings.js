import { useEffect, useState, useContext } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Modal, Group, ActionIcon, Divider, NativeSelect, Text, Input, TextInput, Stack, Button } from '@mantine/core';
import { MonthPickerInput } from '@mantine/dates';
import { IconAdjustmentsHorizontal, IconPlus, IconTrash } from '@tabler/icons';
import { PageContext } from '../PageContext/PageContext';
import { notify } from '../Notify/Notify';
import { dateToDateKey } from '../Util/Util';
import InputMask from 'react-input-mask';

export default function ModelSettings({ isInAdminPage }) {
	const { tableData, modelSettings, setModelSettings } = useContext(PageContext);
	const [modalOpened, { open: modalOpen, close: modalClose }] = useDisclosure(false);
	const [method, setMethod] = useState(modelSettings.method);
	const [performanceMeasure, setPerformanceMeasure] = useState(modelSettings.performanceMeasure);
	const [modelParameters, setModelParameters] = useState({
		order: '',
		seasonalOrder: '',
		lag: '',
		invalidInputs: new Set(),
	});
	const [skips, setSkips] = useState(
		modelSettings.skips.map((skip) => {
			return { name: skip.name, range: skip.dateKeysRange.map((dateKey) => new Date(dateKey)) };
		})
	);

	const defaultButtonStyle = (theme) => ({
		root: {
			backgroundColor: 'rgb(100 116 139)',
			'&:hover': theme.fn.hover({
				backgroundColor: 'rgb(100 116 139)',
			}),
		},
	});

	let nextSelectAfterMethod = null;
	if (method === 'manual' && !isInAdminPage) {
		nextSelectAfterMethod = (
			<>
				<Text fz="sm" fw={500}>
					SARIMA Parameters
				</Text>
				<Text fz="xs" c="dimmed">
					Parameters are used to fit a SARIMA model
				</Text>
				<Group>
					<Input.Wrapper id="order" label="Order" required>
						<Input
							id="order"
							placeholder="(p, d, q)"
							component={InputMask}
							mask="(9, 9, 9)"
							value={modelParameters.order}
							onChange={(event) => {
								const value = event.target.value;
								const invalidInputs = getInvalidModelParameters('order', value);
								setModelParameters({ ...modelParameters, order: value, invalidInputs: invalidInputs });
							}}
							error={modelParameters.invalidInputs.has('order')}
						/>
					</Input.Wrapper>
					<Input.Wrapper id="seasonalOrder" label="Seasonal Order">
						<Input
							id="seasonalOrder"
							placeholder="(P, D, Q)"
							component={InputMask}
							mask="(9, 9, 9)"
							value={modelParameters.seasonalOrder}
							onChange={(event) => {
								const value = event.target.value;
								const invalidInputs = getInvalidModelParameters('seasonalOrder', value);
								setModelParameters({ ...modelParameters, seasonalOrder: value, invalidInputs: invalidInputs });
							}}
							error={modelParameters.invalidInputs.has('seasonalOrder')}
						/>
					</Input.Wrapper>
					<Input.Wrapper id="lag" label="Lag" className="w-11">
						<Input
							id="lag"
							placeholder="m"
							component={InputMask}
							mask="99"
							maskChar=""
							value={modelParameters.lag}
							onChange={(event) => {
								const value = event.target.value;
								const invalidInputs = getInvalidModelParameters('lag', value);
								setModelParameters({ ...modelParameters, lag: value, invalidInputs: invalidInputs });
							}}
							error={modelParameters.invalidInputs.has('lag')}
						/>
					</Input.Wrapper>
				</Group>
			</>
		);
	} else {
		nextSelectAfterMethod = (
			<div>
				<Text fz="sm" fw={500}>
					Performance Measure
				</Text>
				<NativeSelect
					value={performanceMeasure}
					onChange={(event) => setPerformanceMeasure(event.target.value)}
					description="Models are compared based on the chosen performance measure"
					data={[
						{ value: 'mae', label: 'Mean Absolute Error' },
						{ value: 'rmse', label: 'Root Mean Squared Error' },
					]}
				/>
			</div>
		);
	}
	const dateKeys = tableData.dateKeys.sort((a, b) => new Date(a) - new Date(b));
	const [minDate, maxDate] = [new Date(dateKeys[0]), new Date(dateKeys[dateKeys.length - 1])];

	useEffect(() => {
		setPerformanceMeasure(modelSettings.performanceMeasure);
		setSkips(
			modelSettings.skips.map((skip) => {
				return { name: skip.name, range: skip.dateKeysRange.map((dateKey) => new Date(dateKey)) };
			})
		);
	}, [modelSettings]);

	return (
		<>
			<Modal size="lg" centered opened={modalOpened} onClose={modalClose} title="Model Settings">
				<div className="mb-4">
					<Text fz="sm" fw={500}>
						Method
					</Text>
					<NativeSelect
						value={method}
						onChange={(event) => setMethod(event.target.value)}
						disabled={isInAdminPage}
						description="You may enter the parameters for the model or search for the best ones"
						data={[
							{ value: 'automatic', label: 'Automatic - Grid Search Algorithm' },
							{ value: 'manual', label: 'Manual' },
						]}
					/>
				</div>
				{nextSelectAfterMethod}
				<Divider my="sm" />
				<Group position="apart" className="mb-2">
					<div>
						<Text fz="sm" fw={500}>
							Drop Values
						</Text>
						<Text fz="xs" c="dimmed">
							Values within the ranges are skipped from training the models
						</Text>
					</div>

					<ActionIcon
						variant="default"
						onClick={() => {
							const newSkip = {
								range: [null, null],
								name: '',
							};
							setSkips([...skips, newSkip]);
						}}
					>
						<IconPlus size="1rem" />
					</ActionIcon>
				</Group>
				<Stack>
					{skips.map((skip, index) => {
						return (
							<Group key={index} spacing="xs">
								<ActionIcon
									variant="default"
									onClick={() => {
										const tempSkips = [...skips];
										tempSkips.splice(index, 1);
										setSkips(tempSkips);
									}}
								>
									<IconTrash size="1rem" />
								</ActionIcon>
								<MonthPickerInput
									miw={250}
									maw={400}
									type="range"
									size="xs"
									placeholder="Pick dates range"
									value={skip.range}
									maxDate={maxDate}
									minDate={minDate}
									onChange={(dates) => {
										const tempSkips = [...skips];
										tempSkips[index].range = dates;
										setSkips(tempSkips);
									}}
								/>
								<TextInput
									size="xs"
									placeholder="Name"
									miw={220}
									value={skip.name}
									onChange={(event) => {
										const tempSkips = [...skips];
										tempSkips[index].name = event.target.value;
										setSkips(tempSkips);
									}}
								/>
							</Group>
						);
					})}
				</Stack>

				<Group className="mt-5" position="right" spacing="xs">
					<Button size="xs" variant="default" onClick={modalClose}>
						Cancel
					</Button>
					<Button
						size="xs"
						styles={defaultButtonStyle}
						onClick={() => {
							if (method === 'manual' && (modelParameters.order === '' || modelParameters.invalidInputs.size !== 0)) {
								notify('error', 'Invalid model parameters');
								return;
							}

							if (!isValidDateRanges(skips)) {
								notify('error', 'Invalid date ranges');
								return;
							}

							setModelSettings({
								method: method,
								performanceMeasure: performanceMeasure,
								modelParameters: {
									order: orderParamToArr(modelParameters.order),
									seasonalOrder: orderParamToArr(modelParameters.seasonalOrder, modelParameters.lag),
								},
								skips: dateRangeToDateKeysRange(skips),
							});

							modalClose();
						}}
					>
						Save
					</Button>
				</Group>
			</Modal>

			<Group position="center">
				<Button size="xs" variant="default" color="dark" className="px-1.5" onClick={modalOpen}>
					<IconAdjustmentsHorizontal size={'1rem'} />
				</Button>
			</Group>
		</>
	);

	function getInvalidModelParameters(key, value) {
		const invalidInputs = new Set(modelParameters.invalidInputs);

		switch (key) {
			case 'order':
				if (!isValidOrder(value, true)) invalidInputs.add('order');
				else invalidInputs.delete('order');
				break;
			case 'seasonalOrder':
				if (!isValidOrder(value)) return invalidInputs.add(key);
				else if (value !== '' && modelParameters.lag === '') invalidInputs.add('lag');
				else if (value === '' && modelParameters.lag !== '') {
					invalidInputs.delete(key);
					invalidInputs.add('lag');
				} else {
					invalidInputs.delete(key);
					invalidInputs.delete('lag');
				}
				break;
			case 'lag':
				if (value === '' && modelParameters.seasonalOrder !== '') invalidInputs.add('lag');
				else if (value !== '' && modelParameters.seasonalOrder === '') invalidInputs.add('seasonalOrder');
				else {
					invalidInputs.delete(key);
					invalidInputs.delete('seasonalOrder');
				}
				break;
			default:
				return;
		}

		return invalidInputs;
	}
}

function isValidOrder(value, isRequired = false) {
	if (!isRequired && value === '') return true;
	return !value.includes('_') && value !== '';
}

function orderParamToArr(order, lag = null) {
	if (order === '') return [];
	if (lag) {
		const seasonal_order = order
			.slice(1, -1)
			.split(', ')
			.map((numStr) => parseInt(numStr));
		seasonal_order.push(parseInt(lag));
		return seasonal_order;
	}
	return order
		.slice(1, -1)
		.split(', ')
		.map((numStr) => parseInt(numStr));
}

function isValidDateRanges(skips) {
	for (const skip of skips) if (skip.range.includes(null)) return false;
	return true;
}

function dateRangeToDateKeysRange(skips) {
	return skips.map((skip) => {
		return { name: skip.name, dateKeysRange: skip.range.map((date) => dateToDateKey(date)) };
	});
}
