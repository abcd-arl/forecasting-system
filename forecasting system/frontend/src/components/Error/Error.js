import { Helmet } from 'react-helmet';
import { Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons';

export default function Error() {
	return (
		<>
			<Helmet>
				<title>Error | Time Series Forecastng of HIV Cases in the Philippines</title>
			</Helmet>
			<div className="w-full h-full">
				<Alert icon={<IconAlertCircle size="1rem" />} color="red" className="w-fit m-auto flex">
					So sorry, something went wrong while loading the data. Please try to reload the page. <br />
					If this keeps showing up, please consider making a{' '}
					<a href="mailto:abdulrahman.lingga@g.msuiit.edu.ph?subject=System Error | Time Series Forecastng of HIV Cases in the Philippines">
						report
					</a>
					. Thanks a lot!
				</Alert>
			</div>
		</>
	);
}
