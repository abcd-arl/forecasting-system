import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function BarChart({ title, datasets }) {
	const options = {
		// maintainAspectRatio: true,
		// responsive: true,
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
			},
		},
		scales: {
			x: {
				title: {
					display: true,
					text: 'Month and Year',
					font: {
						size: 11,
					},
				},
				ticks: {
					// autoskip: true,
					maxTicksLimit: 6,
					maxRotation: 0,
					minRotation: 0,
					font: {
						size: 11,
					},
				},
			},
			y: {
				title: {
					display: true,
					text: 'Number of Cases',
					font: {
						size: 11,
					},
				},
				beginAtZero: true,
				ticks: {
					autoskip: true,
					maxTicksLimit: 6,
					font: {
						size: 11,
					},
				},
			},
		},
	};

	function getLabels() {
		return Object.keys(datasets[0].series).map((dateKey) => {
			const date = new Date(dateKey);
			return date.toLocaleString([], { year: 'numeric', month: 'short' });
		});
	}

	const data = {
		labels: getLabels(),
		datasets: datasets.map((dataset, idx) => {
			return {
				label: dataset.name,
				data: Object.values(dataset.series),
				// borderColor: 'rgb(15, 82, 186)',
				// borderWidth: 2,
				backgroundColor: dataset.color,
				borderRadius: 2.5,
				// borderSkipped: false,
				// barThickness: 10,
				barPercentage: 0.9,
			};
		}),
	};

	return (
		<>
			<Bar options={options} data={data} />
			<div className="invisible">.</div>
		</>
	);
}
