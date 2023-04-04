import { Line } from 'react-chartjs-2';
import {
	Chart as ChartJS,
	TimeSeriesScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import annotationPlugin from 'chartjs-plugin-annotation';

ChartJS.register(TimeSeriesScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, annotationPlugin);

export default function LineChart({
	title,
	datasets,
	skips = null,
	y_title = 'Number of Cases',
	borderDashes = null,
	isWide = false,
	timeUnit = 'month',
	pointRadius = 0,
}) {
	const annotations = [];
	const data = {
		datasets: datasets.map((dataset, index) => {
			if (skips !== null && skips.datasetIndex === index) {
				const maxValue = Math.max(...Object.values(dataset.series).filter((value) => !isNaN(value)));
				skips.details.forEach((skip) => {
					const [xMin, xMax] = skip.dateKeysRange.map((dateKey) => new Date(dateKey));
					const [yMin, yMax] = [0, maxValue + 300];
					annotations.push(
						{
							type: 'line',
							borderColor: 'gray',
							borderWidth: 1.25,
							label: {
								display: true,
								backgroundColor: 'white',
								borderRadius: 0,
								color: 'gray',
								content: skip.name,
								font: {
									size: 11.5,
								},
							},
							arrowHeads: {
								start: {
									display: true,
									borderColor: 'gray',
									length: 6.5,
								},
								end: {
									display: true,
									borderColor: 'gray',
									length: 6.5,
								},
							},
							xMax: xMax,
							xMin: xMin,
							xScaleID: 'x',
							yMax: yMax,
							yMin: yMax,
							yScaleID: 'y',
						}
						// {
						// 	type: 'line',
						// 	borderColor: 'gray',
						// 	borderDash: [6, 6],
						// 	borderWidth: 1,
						// 	xMax: xMin,
						// 	xMin: xMin,
						// 	xScaleID: 'x',
						// 	yMax: yMax,
						// 	yMin: yMin,
						// 	yScaleID: 'y',
						// },
						// {
						// 	type: 'line',
						// 	borderColor: 'gray',
						// 	borderDash: [6, 6],
						// 	borderWidth: 1,
						// 	xMax: xMax,
						// 	xMin: xMax,
						// 	xScaleID: 'x',
						// 	yMax: yMax,
						// 	yMin: yMin,
						// 	yScaleID: 'y',
						// }
					);
				});
			}

			return {
				label: dataset.name,
				data: (() => {
					const cases = [];
					const dateKeys = Object.keys(dataset.series).sort((a, b) => new Date(a) - new Date(b));

					dateKeys.forEach((dateKey) => {
						cases.push({
							x: new Date(dateKey),
							y: dataset.series[dateKey],
						});
					});

					return cases;
				})(),
				backgroundColor: dataset.color,
				borderColor: dataset.color,
				borderWidth: 1,
				tension: 0.2,
				pointRadius: pointRadius,
				showTooltips: false,
				spanGaps: false,
			};
		}),
	};

	const options = {
		maintainAspectRatio: !isWide,
		responsive: true,
		plugins: {
			title: {
				display: true,
				text: title,
				font: {
					size: 12,
				},
			},
			legend: {
				display: datasets.length > 1,
				labels: {
					boxWidth: 20,
					boxHeight: 3,
					font: {
						size: 11,
					},
				},
				position: 'top',
				align: 'start',
				onClick: (e) => e.stopPropagation(),
			},
			tooltip: {
				callbacks: {
					title: (context) => {
						const date = new Date(context[0].raw.x);
						const formattedDate = date.toLocaleString([], {
							year: 'numeric',
							month: 'long',
						});
						return formattedDate;
					},
				},
			},
			annotation: {
				common: {
					drawTime: 'afterDraw',
				},
				annotations: { ...annotations },
			},
		},
		scales: {
			x: {
				title: {
					display: true,
					text: timeUnit[0].toUpperCase() + timeUnit.slice(1),
					font: {
						size: 11,
					},
				},
				type: 'timeseries',
				ticks: {
					autoskip: true,
					source: 'data',
					bounds: 'data',
					maxRotation: 0,
					minRotation: 0,
					font: {
						size: 11,
					},
				},
				time: {
					unit: timeUnit,
				},
			},
			y: {
				title: {
					display: true,
					text: y_title,
					font: {
						size: 11,
					},
				},
				beginAtZero: true,
				ticks: {
					maxTicksLimit: 8,
					font: {
						size: 11,
					},
				},
			},
		},
	};

	return (
		<>
			<Line data={data} options={options}></Line>
			{isWide || pointRadius === 2 ? <></> : <div className="invisible">to make the chart web-responsive</div>}
		</>
	);
}
