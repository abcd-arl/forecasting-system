import { Helmet } from 'react-helmet';
import { Alert } from '@mantine/core';
import { IconAlertCircle, IconAlertTriangle } from '@tabler/icons';

export default function Error() {
	return (
		<>
			<Helmet>
				<title>Error | Time Series Forecastng of HIV Cases in the Philippines</title>
			</Helmet>
			<div className="w-full h-full flex flex-col gap-3">
				{/* <Alert icon={<IconAlertCircle size="1rem" />} color="red" className="max-w-[600px] m-auto">
					Sorry. I am currently using a free tier subscription in AWS for my API. Unfortunately, I am already reaching
					my limit for this month. With that, I have to stop my server for a while.
					<br />
					<br />
					However, just in case you are still interested in this project, please send me an{' '}
					<a href="mailto:abdulrahman.lingga@g.msuiit.edu.ph">email</a> and I will happily show you around. I could also
					start running the server for you to check it yourself. Thank you and sorry for the inconvenience.
				</Alert> */}
				<Alert icon={<IconAlertCircle size="1rem" />} color="red" className="max-w-[600px] m-auto">
					Sorry, something went wrong while loading the data. Please try to reload the page. <br />
					If this keeps showing up, please consider making a{' '}
					<a href="mailto:abdulrahman.lingga@g.msuiit.edu.ph?subject=System Error | Time Series Forecastng of HIV Cases in the Philippines">
						report
					</a>
					. Thanks a lot! :))
				</Alert>
				<Alert icon={<IconAlertTriangle size="1rem" />} color="orange" className="max-w-[600px] m-auto">
					Most browsers are set to only run websites using HTTPS to provide a more secure connection. Unfortunately, the
					API of this system is running on HTTP, not HTTPS which could explain the error you are experiencing.
					<br />
					<br /> This site does not require you to enter any significant information, sensitive or not, and is
					completely harmless. If you are comfortable, you may set your browser to allow this site to load its contents.{' '}
					<a href="https://www.google.com/search?q=How+do+I+change+my+Site+settings+to+allow+insecure+content%3F">
						Here
					</a>{' '}
					is a quick search of how. <br /> However, just in case you do not want to do that but are still interested in
					this project, please send me an <a href="mailto:abdulrahman.lingga@g.msuiit.edu.ph">email</a> and I will
					happily show you around. Thank you and sorry for the inconvenience.
				</Alert>
			</div>
		</>
	);
}
