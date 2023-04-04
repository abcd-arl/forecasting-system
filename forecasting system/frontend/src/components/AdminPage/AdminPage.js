import { AdminContext } from '../App/App';
import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useCookies } from 'react-cookie';
import { PageContext } from '../PageContext/PageContext';
import { notify } from '../Notify/Notify';
import axios from 'axios';
import Table from '../Table/Table';
import LineChart from '../LineChart/LineChart';
import BarChart from '../BarChart/BarChart';
import Error from '../Error/Error';
import Loading from '../Loading/Loading';
import TableOption from '../TableOption/TableOption';
import TableContainer from '../TableContainer/TableContainter';
import VisualizationContainer from '../VisualizationContainer/VisualizationContainer';
import PerformanceMeasure from '../PerformanceMeasure/PerformanceMeasure';

export default function Admin() {
	const {
		adminTableReducer: [tableData, dispatch],
		adminChartsState: [chartsData, setChartsData],
		adminModelSettings: [modelSettings, setModelSettings],
		setIsTableUpdated,
	} = useContext(AdminContext);
	const navigate = useNavigate();
	const [cookies] = useCookies(['token']);

	const original = useQuery(['admin'], getForecastData, {
		staleTime: Infinity,
		cacheTime: Infinity,
		onSuccess: (data) => {
			const dateKeys = Object.keys(data.time_series.raw).sort((a, b) => new Date(a) - new Date(b));
			const table = {
				dateKeys: dateKeys,
				series: data.time_series.raw,
				savedSeries: data.time_series.raw,
				isRecentlySaved: true,
				lastDefaultDateKey: null,
				errors: new Set([]),
				history: [],
				activity: {
					name: 'standby',
					fromDateKey: null,
					toDateKey: null,
				},
			};
			setChartsData({
				actual: {
					name: 'Actual',
					series: data.time_series.raw,
					color: '#658EA9',
				},
				test: {
					name: 'Test',
					series: data.model_details.info.test,
					color: '#88B2CC',
				},
				predicted: {
					name: 'Predicted',
					series: data.model_details.info.predicted,
					color: '#E98973',
				},
				residuals: {
					name: 'Residuals',
					series: data.model_details.info.residuals,
					color: '#D3B1C2',
				},
				performance_measure: data.model_details.info.performance_measure,
				data_description: data.data_description,
			});
			setModelSettings({
				skips: data.model_details.settings.skips,
				performanceMeasure: data.model_details.settings.performance_measure,
				method: 'automatic',
			});
			dispatch({ type: 'initialize', data: table });
		},
	});
	const updateTable = useMutation(postUpdateTable, {
		onSuccess: (data) => {
			const dateKeys = Object.keys(data.time_series.raw).sort((a, b) => new Date(a) - new Date(b));
			const table = {
				dateKeys: dateKeys,
				series: data.time_series.raw,
				savedSeries: tableData.savedSeries,
				isRecentlySaved: true,
				lastDefaultDateKey: null,
				errors: tableData.errors,
				history: tableData.history,
				activity: {
					name: 'standby',
					fromDateKey: null,
					toDateKey: null,
				},
			};
			setChartsData({
				actual: {
					name: 'Actual',
					series: data.time_series.raw,
					color: '#1863D6',
				},
				test: {
					name: 'Test',
					series: data.model_details.info.test,
					color: '#0091E7',
				},
				predicted: {
					name: 'Predicted',
					series: data.model_details.info.predicted,
					color: '#F37970',
				},
				residuals: {
					name: 'Residuals',
					series: data.model_details.info.residuals,
					color: '#D3B1C2',
				},
				performance_measure: data.model_details.info.performance_measure,
				data_description: data.data_description,
			});
			dispatch({ type: 'initialize', data: table });
			setIsTableUpdated(true);
		},
		onError: (error) => {
			notify('error', 'Error occured while generating forecasts');
		},
	});
	const uploadCSV = useMutation(readFile, {
		onSuccess: (data) => {
			const message =
				'Your file has more than five invalid values. Continue? Invalid values will be converted to NaN values.';
			if (data.errorMessages.length > 5 && !window.confirm(message)) return;
			data.errorMessages.forEach((message) => notify('warning', message));
			if (data.isToAppendChecked) dispatch({ type: 'append', valuesToAppend: data.cases });
			else {
				data.setMonthPickerValue(new Date(data.startDate));
				dispatch({ type: 'replace', startDate: data.startDate, valuesAsReplacements: data.cases });
			}
		},
		onError: (error) => {
			notify('error', 'Error occured while uploading the data');
		},
	});

	useEffect(() => {
		console.log(tableData);
		if (!cookies.token) navigate('/login');
	});

	if (original.isLoading) return <Loading />;
	if (original.isError) return <Error />;
	if (!cookies.token) return;
	if (Object.keys(tableData).length === 0) return;

	return (
		<PageContext.Provider
			value={{
				tableData,
				dispatch,
				chartsData,
				setChartsData,
				modelSettings,
				setModelSettings,
			}}
		>
			<VisualizationContainer isLoading={updateTable.isLoading}>
				<VisualizationContainer type={'doubly'}>
					<VisualizationContainer type={'doubly__child'}>
						<LineChart title={'Actual'} datasets={[chartsData.actual]} timeUnit={'year'} />
					</VisualizationContainer>
					<VisualizationContainer type={'doubly__child'}>
						<BarChart title={'Residuals'} datasets={[chartsData.residuals]} />
					</VisualizationContainer>
				</VisualizationContainer>
				<VisualizationContainer type={'doubly'}>
					<VisualizationContainer type={'doubly__child'}>
						<BarChart title={'Test vs Predicted'} datasets={[chartsData.test, chartsData.predicted]} />
					</VisualizationContainer>
					<VisualizationContainer type={'doubly__child'}>
						<PerformanceMeasure measures={chartsData.performance_measure} />
					</VisualizationContainer>
				</VisualizationContainer>
			</VisualizationContainer>

			<TableContainer isLoading={updateTable.isLoading || uploadCSV.isLoading}>
				<TableOption mutate={updateTable.mutate} upload={uploadCSV.mutate} />
				<Table />
			</TableContainer>
		</PageContext.Provider>
	);

	async function getForecastData() {
		const response = await axios.get('http://127.0.0.1:8000/api/v1/update-table/', {
			headers: {
				Authorization: `Token ${cookies.token}`,
			},
		});
		return response.data;
	}

	async function postUpdateTable(params) {
		const response = await axios.post(
			'http://127.0.0.1:8000/api/v1/update-table/',
			{
				series: params.series,
				startingDateKey: params.startingDateKey,
				settings: params.settings,
			},
			{
				headers: {
					Authorization: `Token ${cookies.token}`,
				},
			}
		);

		return response.data;
	}

	function readFile({ csvFile, isToAppendChecked, setMonthPickerValue }) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			const data = {
				startDate: null,
				cases: [],
				errorMessages: [],
				setMonthPickerValue: setMonthPickerValue,
				isToAppendChecked: isToAppendChecked,
			};

			reader.onload = function (event) {
				const csvContents = event.target.result;
				const headers = csvContents.slice(0, csvContents.indexOf('\r')).split(',');
				const casesIndex = headers.indexOf('No. of New HIV Cases');
				const dateIndex = headers.indexOf('Date');

				if (casesIndex < 0) return reject('Missing "No. of New HIV Cases" in header.');
				if (!isToAppendChecked && dateIndex < 0) return reject('Missing "Date" in header.');

				const rows = csvContents.slice(csvContents.indexOf('\n') + 1).split('\r\n');
				const tempErrorMessages = {};
				rows.forEach((row, index) => {
					const value = parseInt(row.split(',')[casesIndex]);
					data.cases.push(value);
					if (!value || value < 0)
						tempErrorMessages[index] = `Value in row ${index} in the file is not valid, but converted to 'NaN'`;
					return null;
				});

				if (!isToAppendChecked) {
					let firstIndex = 0;
					while (isNaN(data.cases[firstIndex])) firstIndex = firstIndex + 1;

					const firstDate = csvContents.slice(csvContents.indexOf('\n') + 1).split('\r\n')[firstIndex];
					const initialStartDate = new Date(firstDate.split(',')[dateIndex]);

					data.cases = data.cases.slice(firstIndex);
					Object.keys(tempErrorMessages).forEach((key) => {
						if (firstIndex <= key) data.errorMessages.push(tempErrorMessages[key]);
					});

					if (initialStartDate instanceof Date && !isNaN(initialStartDate)) {
						data.startDate = initialStartDate.toISOString().substring(0, 10);
					} else return reject('Invalid dates format.');
				} else {
					data.errorMessages = Object.values(tempErrorMessages);
				}

				resolve(data);
			};

			reader.onerror = function (event) {
				reject('Error reading the file.');
			};

			reader.readAsText(csvFile);
		});
	}
}
