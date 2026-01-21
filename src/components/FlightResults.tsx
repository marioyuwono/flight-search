'use client'

import { useMemo, useState } from 'react'
import { FlightFilters } from './FlightFilters'
import { FlightList } from './FlightList'
import { iFlightFilter } from './Interfaces'

export function FlightResults({
  searchResults,
}: Readonly<{
  searchResults: any
}>) {
  const [filters, setFilters] = useState<iFlightFilter>({
    stops: 'any',
    airlines: [],
    priceRange: [0, 1000],
    departureTime: [0, 1440],
    arrivalTime: [0, 1440],
    connectingAirports: [],
    maxDuration: 1440,
  })

  // Initialize price range based on actual flight data
  const initialPriceRange = useMemo(() => {
    if (!searchResults?.data || searchResults.data.length === 0) {
      return [0, 1000]
    }
    const prices = searchResults.data
      .map((f: any) => parseFloat(f.price?.total || 0))
      .filter((p: number) => p > 0)
    const min = Math.min(...prices)
    const max = Math.max(...prices)
    return [min, max]
  }, [searchResults])

  // Update filter price range when data changes
  useMemo(() => {
    if (filters.priceRange[0] === 0 && filters.priceRange[1] === 1000) {
      setFilters((prev) => ({
        ...prev,
        priceRange: initialPriceRange,
        maxDuration: 1440,
      }))
    }
  }, [initialPriceRange])

  const filteredFlights = useMemo(() => {
    if (!searchResults?.data) return []

    return searchResults.data.filter((flight: any) => {
      // Filter by price
      const price = parseFloat(flight.price?.total || 0)
      if (price < filters.priceRange[0] || price > filters.priceRange[1]) {
        return false
      }

      const itinerary = flight.itineraries?.[0]
      if (!itinerary) return false

      const segments = itinerary.segments || []

      // Filter by stops
      const numStops = segments.length - 1
      if (filters.stops === 'nonstop' && numStops !== 0) return false
      if (filters.stops === 'one' && numStops > 1) return false
      if (filters.stops === 'two' && numStops > 2) return false

      // Filter by airlines
      if (filters.airlines.length > 0) {
        const hasMatchingAirline = segments.some((seg: any) =>
          filters.airlines.includes(seg.carrierCode)
        )
        if (!hasMatchingAirline) return false
      }

      // Filter by connecting airports
      if (filters.connectingAirports.length > 0) {
        const connectingAirports = segments
          .slice(0, -1)
          .map((seg: any) => seg.arrival.iataCode)
        const hasMatchingAirport = connectingAirports.some((airport) =>
          filters.connectingAirports.includes(airport)
        )
        if (!hasMatchingAirport) return false
      }

      // Filter by departure time
      const departureTime = segments[0]?.departure?.at
      if (departureTime) {
        const depDate = new Date(departureTime)
        const depMinutes = depDate.getHours() * 60 + depDate.getMinutes()
        if (
          depMinutes < filters.departureTime[0] ||
          depMinutes > filters.departureTime[1]
        ) {
          return false
        }
      }

      // Filter by arrival time
      const arrivalTime = segments[segments.length - 1]?.arrival?.at
      if (arrivalTime) {
        const arrDate = new Date(arrivalTime)
        const arrMinutes = arrDate.getHours() * 60 + arrDate.getMinutes()
        if (
          arrMinutes < filters.arrivalTime[0] ||
          arrMinutes > filters.arrivalTime[1]
        ) {
          return false
        }
      }

      // Filter by max duration
      const durationMatch = itinerary.duration?.match(/PT(?:(\d+)H)?(?:(\d+)M)?/)
      if (durationMatch) {
        const hours = parseInt(durationMatch[1]) || 0
        const minutes = parseInt(durationMatch[2]) || 0
        const totalMinutes = hours * 60 + minutes
        if (totalMinutes > filters.maxDuration) return false
      }

      return true
    })
  }, [searchResults, filters])

  if (!searchResults) {
    return null
  }

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        Flight Results
      </h3>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">

        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <FlightFilters
            flights={searchResults.data || []}
            filters={filters}
            onFilterChange={setFilters}
          />
        </div>

        {/* Flights List */}
        <div className="lg:col-span-3">
          <FlightList searchResults={searchResults} filteredFlights={filteredFlights} />
        </div>
      </div>
    </div>
  )
}
