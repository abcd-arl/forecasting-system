import { useContext } from 'react';
import { PageContext } from '../PageContext/PageContext';
import { Button } from '@mantine/core';

export default function GenerateForecast({ mutate }) {
	const { tableData, modelSettings } = useContext(PageContext);

	return (
		<Button
			size="xs"
			variant="gradient"
			gradient={{ from: '#ed6ea0', to: '#ec8c69', deg: 35 }}
			onClick={() => mutate({ series: tableData.savedSeries, settings: modelSettings })}
		>
			Generate Forecast
		</Button>
	);
}
