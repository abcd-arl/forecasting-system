export default function DataDescription({ description }) {
	return (
		<>
			<p className="relative bottom-1.5 font-bold text-[12px] text-[#666] text-center">Data Description</p>
			<table className="w-full border-collapse">
				<thead>
					<tr className="">
						<th className="h-7 w-1/2 font-bold text-[12px] text-center bg-gray-200 border border-solid border-gray-300">
							Name
						</th>
						<th className="h-7 w-3/4 font-bold text-[12px] text-center bg-gray-200 border border-solid border-gray-300">
							Value
						</th>
					</tr>
				</thead>
				<tbody>
					{description &&
						Object.keys(description).map((name) => (
							<tr>
								<td
									key={'name-' + name}
									className="h-7 text-[12px] text-center bg-gray-200 border border-solid border-gray-300"
								>
									{name}
								</td>
								<td key={'data-' + name} className="text-[12px] text-center border border-solid border-gray-300">
									{!Number.isInteger(description[name]) ? description[name].toFixed(2) : description[name]}
								</td>
							</tr>
						))}
				</tbody>
			</table>
		</>
	);
}
