import { iFlightSearchForm } from "./Interfaces"

export function FlightResults({
	searchResults,
}: Readonly<{
	searchResults: any
}>) {

	if (!searchResults) {
		return null
	}

	return (
		<div className="mt-8">
			<h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
				Flight Results
			</h3>
			<div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
				<p className="text-gray-700 dark:text-gray-300 mb-2">
					<strong>Found {searchResults.data?.length || 0} flights</strong>
				</p>
				{searchResults.data && searchResults.data.length > 0 ? (
					<div className="space-y-3">
						{searchResults.data.map((flight: any, index: number) => (
							<div
								key={index}
								className="bg-white dark:bg-slate-800 p-3 rounded border border-gray-200 dark:border-gray-700"
							>
								<div className="flex justify-between items-start mb-2">
									<div>
										<p className="text-sm font-semibold text-gray-900 dark:text-white">
											{flight.itineraries?.[0]?.segments?.[0]?.departure?.iataCode} →{' '}
											{flight.itineraries?.[0]?.segments?.[0]?.arrival?.iataCode}
										</p>
										<p className="text-xs text-gray-600 dark:text-gray-400">
											{flight.itineraries?.[0]?.segments?.[0]?.departure?.at}
										</p>
									</div>
									<div className="text-right">
										<p className="text-lg font-bold text-blue-600">
											{flight.price?.total} {flight.price?.currency}
										</p>
									</div>
								</div>
								<p className="text-xs text-gray-600 dark:text-gray-400">
									Duration:{' '}
									{flight.itineraries?.[0]?.duration}
								</p>
							</div>
						))}
					</div>
				) : (
					<p className="text-gray-700 dark:text-gray-300">
						No flights found. Please try different search parameters.
					</p>
				)}
			</div>
		</div>
	)
}
