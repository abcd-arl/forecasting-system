export default function PerformanceMeasure({ measures }) {
	return (
		<>
			<p className="relative bottom-1.5 mb-0 font-bold text-[12px] text-[#666] text-center">Performance Measure</p>
			<div className="min-h-[170px] md:h-[80%] h-[100%] w-[90%] m-auto bg-40 bg-bottom bg-gradient-radial flex items-center">
				<div className="w-full flex flex-col sm:flex-row items-center gap-2 justify-between">
					<div className="flex flex-col-reverse sm:flex-col">
						<span className="text-xs text-center sm:text-left text-zinc-500 font-bold">MAE</span>
						<span className="text-[2.25rem] md:text-[1.7em] lg:text-4xl xl:text-5xl text-rose-300">
							{!Number.isInteger(measures['mae']) ? measures['mae'].toFixed(2) : measures['mae']}
						</span>
					</div>
					<div className="flex flex-col-reverse sm:flex-col">
						<span className="text-xs text-center sm:text-left text-zinc-500 font-bold">RMSE</span>
						<span className="text-[2.25rem] md:text-[1.7em] lg:text-4xl xl:text-5xl text-rose-300">
							{!Number.isInteger(measures['rmse']) ? measures['rmse'].toFixed(2) : measures['rmse']}
						</span>
					</div>
					<div className="flex flex-col-reverse sm:flex-col">
						<span className="text-xs text-center sm:text-left text-zinc-500 font-bold">MAPE</span>
						<span className="text-[2.25rem] md:text-[1.7em] lg:text-4xl xl:text-5xl text-rose-300">
							{(!Number.isInteger(measures['mape']) ? measures['mape'].toFixed(2) : measures['mape']) * 100 + '%'}
						</span>
					</div>
				</div>
			</div>
		</>
	);
}
