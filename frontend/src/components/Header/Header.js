import { Link } from 'react-router-dom';
import { Alert } from '@mantine/core';
import { IconAlertTriangle } from '@tabler/icons';
import { useState } from 'react';

export default function Header() {
	const [alertOpened, setAlertOpened] = useState(true);

	return (
		<header className="mb-10 flex flex-col justify-between items-center">
			<Link to="/" className="mb-1 mt-7 h-fit w-full my-9 text-center text-[#5f5e5a] no-underline">
				<h1 className="w-fit font-['Imperial'] text-[1.5rem] sm:text-[2.1rem] m-auto">
					TIME SERIES FORECASTING OF HIV CASES IN THE PHILIPPINES
				</h1>
			</Link>
			<span className="font-['Open Serif] text-[#5f5e5a] text-sm">An Undergraduate Thesis by Abdulrahman Lingga</span>
			{alertOpened && (
				<Alert
					icon={<IconAlertTriangle size="1rem" />}
					color="orange"
					withCloseButton
					closeButtonLabel="Close alert"
					className="absolute top-3 p-1.5"
					onClose={() => setAlertOpened(false)}
				>
					The ranges to search for the model parameters are shorten for this demo.
					<span className="mr-3" />
				</Alert>
			)}
		</header>
	);
}
