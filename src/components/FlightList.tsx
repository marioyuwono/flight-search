import { ArrowLongRightIcon } from "@heroicons/react/24/solid"
import { formatDuration } from "./Methods"

export function FlightList({
  searchResults,
  filteredFlights,
}: Readonly<{
  searchResults: any
  filteredFlights: any
}>) {
  console.log('filteredFlights:', JSON.stringify(filteredFlights))
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
                className="flex flex-col md:flex-row w-full justify-between bg-white dark:bg-slate-800 p-4 rounded border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow gap-4"
              >
                {/* Time and IATA Code */}
                <div className="flex-1">
                  <div className="flex gap-2">
                    <FlightTimeAndIataCode row={segments[0]} direction="departure" />
                    <ArrowLongRightIcon className="size-6 pt-2" />
                    <FlightTimeAndIataCode row={segments[segments.length - 1]} direction="arrival" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-700 dark:text-gray-300 rounded">
                      {numStops === 0
                        ? 'Nonstop'
                        : `${numStops} stop${numStops > 1 ? 's' : ''}`}
                      {' • '}
                      {formatDuration(flight.itineraries?.[0]?.duration)}
                    </span>
                  </div>
                </div>

                {/* Segments Details */}
                <FlightConnections segments={segments} numStops={numStops} />

                {/* Price */}
                <div className="flex-1 md:text-right">
                  <p className="text-lg font-bold text-blue-600">
                    {flight.price?.currency} {flight.price?.total}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Duration:{' '}
                    {flight.itineraries?.[0]?.duration}
                  </p>
                </div>
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

function FlightTimeAndIataCode({
  row,
  direction,
}: {
  row: any
  direction: string
}) {
  return (
    <div>
      <span className="text-xl text-gray-900 dark:text-gray-400">
        {new Date(row[direction]?.at).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </span>
      <br />
      <span className="text-sm">
        {row[direction]?.iataCode}
      </span>
    </div>
  )
}

function FlightConnections({
  segments,
  numStops,
}: {
  segments: any[]
  numStops: number
}) {
  if (segments.length < 1) {
    return null
  }
  return (
    <div className="text-xs text-gray-600 dark:text-gray-400">
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
  )
}
