
export function FlightList({
  searchResults,
  filteredFlights,
}: Readonly<{
  searchResults: any
  filteredFlights: any
}>) {
  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
      <p className="text-gray-700 dark:text-gray-300 mb-4">
        <strong>
          Found {filteredFlights.length} of {searchResults.data?.length || 0} flights
        </strong>
      </p>
      {filteredFlights.length > 0 ? (
        <div className="space-y-3">
          {filteredFlights.map((flight: any, index: number) => {
            const segments = flight.itineraries?.[0]?.segments || []
            const numStops = segments.length - 1

            return (
              <div
                key={index}
                className="bg-white dark:bg-slate-800 p-4 rounded border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {segments[0]?.departure?.iataCode} →{' '}
                        {segments[segments.length - 1]?.arrival?.iataCode}
                      </p>
                      <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">
                        {numStops === 0
                          ? 'Nonstop'
                          : `${numStops} stop${numStops > 1 ? 's' : ''}`}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {new Date(segments[0]?.departure?.at).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                      {' - '}
                      {new Date(segments[segments.length - 1]?.arrival?.at).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-blue-600">
                      €{flight.price?.total}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Duration:{' '}
                      {flight.itineraries?.[0]?.duration}
                    </p>
                  </div>
                </div>

                {/* Segments Details */}
                {segments.length > 1 && (
                  <div className="text-xs text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-2">
                    <p className="font-medium">Connections:</p>
                    <div className="ml-2">
                      {segments.map((seg: any, idx: number) => (
                        <div key={idx} className="mb-1">
                          {seg.departure.iataCode} ({seg.carrierCode}
                          {seg.number}) → {seg.arrival.iataCode}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        <p className="text-gray-700 dark:text-gray-300">
          No flights match your filters. Try adjusting your search criteria.
        </p>
      )}
    </div>

  )
}
