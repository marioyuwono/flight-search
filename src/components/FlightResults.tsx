'use client'

import { IFlightFilter } from '@/types/flight'
import { useMemo, useState } from 'react'
import { FlightCharts } from './FlightCharts'
import { FlightFilters } from './FlightFilters'
import { FlightList } from './FlightList'

export function FlightResults({
  searchResults,
}: Readonly<{
  searchResults: any
}>) {
  const [activeTab, setActiveTab] = useState<'filters' | 'charts'>('filters')
  const [filters, setFilters] = useState<IFlightFilter>({
    stops: 'any',
    airlines: [],
    priceRange: [0, 1000],
    departureTime: [0, 1440],
    arrivalTime: [0, 1440],
    connectingAirports: [],
    maxDuration: 1440,
  })

  const handleChartFilterChange = (filterType: string, value: string) => {
    switch (filterType) {
      case 'availability':
        if (value === 'Direct') {
          setFilters((prev) => ({ ...prev, stops: 'nonstop' }))
        } else if (value === 'One Stop') {
          setFilters((prev) => ({ ...prev, stops: 'one' }))
        } else if (value === '2+ Stops') {
          setFilters((prev) => ({ ...prev, stops: 'two' }))
        }
        break
      case 'airline':
        setFilters((prev) => ({
          ...prev,
          airlines: [value],
        }))
        break
      case 'destination':
        // Destination filter would require route change
        break
      case 'departureTime':
        // Parse time range and set departure time filter
        const timeMap: Record<string, [number, number]> = {
          '00:00-06:00': [0, 360],
          '06:00-12:00': [360, 720],
          '12:00-18:00': [720, 1080],
          '18:00-24:00': [1080, 1440],
        }
        if (timeMap[value]) {
          setFilters((prev) => ({
            ...prev,
            departureTime: timeMap[value],
          }))
        }
        break
      case 'duration':
        // Parse duration range and set max duration filter
        const durationMap: Record<string, number> = {
          '0-3h': 180,
          '3-6h': 360,
          '6-12h': 720,
          '12h+': 1440,
        }
        if (durationMap[value]) {
          setFilters((prev) => ({
            ...prev,
            maxDuration: durationMap[value],
          }))
        }
        break
    }
  }

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
        priceRange: initialPriceRange as [number, number],
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
        const hasMatchingAirport = connectingAirports.some((airport: string) =>
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

  const sidebarColSpan = activeTab === 'filters' ? 'lg:col-span-1' : 'lg:col-span-2'
  const contentColSpan = activeTab === 'filters' ? 'lg:col-span-4' : 'lg:col-span-3'

  return (
    <>
      <div className="my-8">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Flight Results
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

          {/* Sidebar with Tabs */}
          <div className={`${sidebarColSpan}`}>
            {/* Tab Buttons */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setActiveTab('filters')}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'filters'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                Filters
              </button>
              <button
                onClick={() => setActiveTab('charts')}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'charts'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                Analytics
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'filters' && (
              <FlightFilters
                flights={searchResults.data || []}
                filters={filters}
                onFilterChange={setFilters}
              />
            )}
            {activeTab === 'charts' && (
              <FlightCharts
                flights={searchResults.data || []}
                onChartFilterChange={handleChartFilterChange}
              />
            )}
          </div>

          {/* Flights List */}
          <div className={`${contentColSpan}`}>
            <FlightList searchResults={searchResults} filteredFlights={filteredFlights} />
          </div>
        </div>
      </div>
    </>
  )
}
