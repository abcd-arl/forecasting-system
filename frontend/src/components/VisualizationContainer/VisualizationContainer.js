import Loading from '../Loading/Loading';

export default function VisualizationContainer({ type, isLoading, children }) {
	const isLoadingStyle = isLoading ? 'pointer-events-none opacity-50 z-0 ' : '';
	let div = null;
	switch (type) {
		case 'singly':
			div = <div className={isLoadingStyle + 'mb-2 h-72 md:h-80 lg:h-96'}>{children}</div>;
			break;
		case 'doubly':
			div = <div className={isLoadingStyle + ' mb-3 md:flex gap-4'}>{children}</div>;
			break;
		case 'doubly__child':
			div = <div className="md:w-2/4">{children}</div>;
			break;
		default:
			div = (
				<div className="relative">
					{isLoading && <Loading />}
					<div className={isLoadingStyle}>{children}</div>
				</div>
			);
	}

	return <>{div}</>;
}
