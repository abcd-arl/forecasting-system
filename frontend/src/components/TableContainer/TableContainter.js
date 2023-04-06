export default function TableContainer({ isLoading, children }) {
	const isLoadingStyle = isLoading ? 'pointer-events-none opacity-50 ' : '';

	return <div className={isLoadingStyle + 'mt-6'}>{children}</div>;
}
