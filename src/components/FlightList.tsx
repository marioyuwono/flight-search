import { useAirportCache } from "@/contexts/AirportCacheContext"
import { getAirlineName } from "@/utils/chartDataProcessors"
import { ArrowLongRightIcon } from "@heroicons/react/24/solid"
import { formatDuration, formatSentences } from "./Methods"

export function FlightList({
  searchResults,
  filteredFlights,
}: Readonly<{
  searchResults: any
  filteredFlights: any
}>) {
  const { getAirport } = useAirportCache()
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
            const carrierCode = segments[0]?.carrierCode
            const amenities = flight.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.amenities || []

            return (
              <div
                key={index}
                className="flex flex-col md:flex-row w-full justify-between bg-white dark:bg-slate-800 p-4 rounded border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow gap-4"
              >
                {/* Time and IATA Code */}
                <div className="flex-1">
                  <div className="flex gap-2">
                    <FlightTimeAndIataCode row={segments[0]} direction="departure" getAirport={getAirport} />
                    <ArrowLongRightIcon className="size-6 pt-2" />
                    <FlightTimeAndIataCode row={segments[segments.length - 1]} direction="arrival" getAirport={getAirport} />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-700 dark:text-gray-300 rounded">
                      {numStops === 0
                        ? 'Nonstop'
                        : `${numStops} stop${numStops > 1 ? 's' : ''}`}
                      {' • '}
                      {formatDuration(flight.itineraries?.[0]?.duration)}
                      {' • '}
                      {carrierCode && getAirlineName(carrierCode)}
                    </span>
                  </div>
                </div>

                <div>
                  {/* Segments Details */}
                  <FlightConnections segments={segments} numStops={numStops} getAirport={getAirport} />

                  {/* Amenities */}
                  <FlightAmenities amenities={amenities} />
                </div>

                {/* Price */}
                <div className="flex-1 md:text-right">
                  <p className="text-lg text-nowrap font-bold text-blue-600">
                    {flight.price?.currency} {flight.price?.total}
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
  getAirport,
}: {
  row: any
  direction: string
  getAirport: (iataCode: string) => any
}) {
  const iataCode = row[direction]?.iataCode
  const airport = getAirport(iataCode)
  const displayName = airport?.name || iataCode

  return (
    <div>
      <span className="text-xl text-nowrap text-gray-900 dark:text-gray-400">
        {new Date(row[direction]?.at).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </span>
      <br />
      <span className="text-sm">
        {iataCode}
      </span>
    </div>
  )
}

function FlightConnections({
  segments,
  numStops,
  getAirport,
}: {
  segments: any[]
  numStops: number
  getAirport: (iataCode: string) => any
}) {
  if (segments.length < 1) {
    return null
  }
  return (
    <div className="text-xs text-gray-600 dark:text-gray-400">
      <p className="font-medium">Connections:</p>
      <ul className="list-disc list-inside">
        {segments.map((seg: any, idx: number) => {
          const departureAirport = getAirport(seg.departure.iataCode)
          const arrivalAirport = getAirport(seg.arrival.iataCode)
          const departureName = formatSentences(departureAirport?.name) || seg.departure.iataCode
          const arrivalName = formatSentences(arrivalAirport?.name) || seg.arrival.iataCode

          return (
            <li key={idx} className="mb-1">
              {departureName} [{seg.departure.iataCode}] ({seg.carrierCode}
              {seg.number}) → {arrivalName} [{seg.arrival.iataCode}]
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function FlightAmenities({
  amenities
}: {
  amenities: any
}) {
  if (amenities.length < 1) {
    return null
  }
  return (
    <div className="text-xs text-gray-600 dark:text-gray-400 mt-2">
      <p className="font-medium mb-1">Amenities:</p>
      <ul className="list-disc list-inside">
        {amenities.slice(0, 3).map((amenity: any, idx: number) => (
          <li key={idx}>
            {formatSentences(amenity.description)}
          </li>
        ))}
        {amenities.length > 3 && <li>+{amenities.length - 3} more</li>}
      </ul>
    </div>
  )
}
