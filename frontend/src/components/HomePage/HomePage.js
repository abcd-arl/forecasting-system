import { useEffect, useContext } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { HomeContext } from '../App/App';
import { PageContext } from '../PageContext/PageContext';
import { notify } from '../Notify/Notify';
import axios from 'axios';
import Table from '../Table/Table';
import TableOption from '../TableOption/TableOption';
import TableContainer from '../TableContainer/TableContainter';
import VisualizationContainer from '../VisualizationContainer/VisualizationContainer';
import LineChart from '../LineChart/LineChart';
import LineChartRanged from '../LineChartRanged/LineChartRanged';
import BarChart from '../BarChart/BarChart';
import Error from '../Error/Error';
import Loading from '../Loading/Loading';

export default function HomePage() {
	const {
		homeTableReducer: [tableData, dispatch],
		homeChartsState: [chartsData, setChartsData],
		homeModelSettings: [modelSettings, setModelSettings],
		isTableUpdated,
		setIsTableUpdated,
	} = useContext(HomeContext);

	const original = useQuery(['home'], getForecastData, {
		staleTime: Infinity,
		cacheTime: Infinity,
		manual: true,
		onSuccess: (data) => {
			const dateKeys = Object.keys(data.time_series.raw).sort((a, b) => new Date(a) - new Date(b));
			const tableData = {
				dateKeys: dateKeys,
				series: data.time_series.raw,
				savedSeries: data.time_series.raw,
				isRecentlySaved: true,
				lastDefaultDateKey: dateKeys[dateKeys.length - 1],
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
					color: '#1863D6',
				},
				forecasts: {
					name: 'Forecast',
					series: data.forecasts,
					color: '#F37970',
				},
			});
			setModelSettings({
				skips: data.model_details.settings.skips,
				performanceMeasure: data.model_details.settings.performance_measure,
				method: 'automatic',
			});
			dispatch({ type: 'initialize', data: tableData });
		},
	});
	const forecasts = useMutation(postForecastData, {
		onSuccess: (data) => {
			setChartsData({
				actual: {
					name: 'Actual',
					series: data.time_series.raw,
					color: '#1863D6',
				},
				forecasts: {
					name: 'Forecast',
					series: data.forecasts,
					color: '#F37970',
				},
				skips: data.model_details.settings.dates_to_drop,
			});
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
		if (isTableUpdated) {
			original.refetch();
			setIsTableUpdated(false);
		}
	});

	if (original.isLoading) return <Loading />;
	if (original.isError) return <Error />;
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
			<VisualizationContainer isLoading={forecasts.isLoading || original.isRefetching}>
				<VisualizationContainer type={'singly'} isLoading={forecasts.isLoading}>
					<LineChart
						title={'Actual Cases vs Forecasts'}
						datasets={[chartsData.actual, chartsData.forecasts]}
						skips={{ datasetIndex: 0, details: modelSettings.skips }}
						timeUnit="year"
						isWide={true}
					/>
				</VisualizationContainer>
				<VisualizationContainer type={'doubly'} isLoading={forecasts.isLoading}>
					<VisualizationContainer type={'doubly__child'}>
						<BarChart title={'Forecasts'} datasets={[chartsData.forecasts]} />
					</VisualizationContainer>
					<VisualizationContainer type={'doubly__child'}>
						<LineChartRanged title={'Actual Cases'} dataset={chartsData.actual} />
					</VisualizationContainer>
				</VisualizationContainer>
			</VisualizationContainer>

			<TableContainer isLoading={original.isRefetching || uploadCSV.isLoading}>
				<TableOption mutate={forecasts.mutate} upload={uploadCSV.mutate} />
				<Table />
			</TableContainer>
		</PageContext.Provider>
	);

	async function getForecastData() {
		const response = await axios.get(process.env.REACT_APP_SERVER_URL + '/api/v1/forecast/');
		return response.data;
	}

	async function postForecastData(params) {
		const response = await axios.post(process.env.REACT_APP_SERVER_URL + '/api/v1/forecast/', {
			series: params.series,
			settings: params.settings,
		});
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
