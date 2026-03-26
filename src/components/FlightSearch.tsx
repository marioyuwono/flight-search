'use client'

import { AirportCacheProvider } from '@/contexts/AirportCacheContext'
import { IFlightSearchFormData } from '@/types/flight'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { FlightCabinClass } from './FlightCabinClass'
import { FlightDepartureAndReturnDate } from './FlightDepartureAndReturnDate'
import { FlightPassengers } from './FlightPassengers'
import { FlightResults } from './FlightResults'
import { FlightSourceAndDestination } from './FlightSourceAndDestination'
import { FlightTripTypeSelection } from './FlightTripTypeSelection'


export function FlightSearch() {
  return (
    <AirportCacheProvider>
      <FlightSearchContent />
    </AirportCacheProvider>
  )
}

export function FlightSearchContent() {
  const formMethods = useForm<IFlightSearchFormData>({
    defaultValues: {
      tripType: 'roundtrip',
      adults: 1,
      children: 0,
      infants: 0,
      cabinClass: 'ECONOMY',
    },
  })
  const {
    handleSubmit,
  } = formMethods
  const [isLoading, setIsLoading] = useState(false)
  const [searchResults, setSearchResults] = useState<any>(null)
  const [errorMessage, setErrorMessage] = useState('')

  const onSubmit = async (data: IFlightSearchFormData) => {
    setIsLoading(true)
    setErrorMessage('')
    setSearchResults(null)

    try {
      // Call the API route to search flights
      const response = await fetch('/api/flights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to search flights')
      }

      const results = await response.json()
      setSearchResults(results)
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'An error occurred while searching for flights'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full mx-auto">
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-6 md:p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Search Flights
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Trip Type Selection */}
          <FlightTripTypeSelection formMethods={formMethods} />

          <div className='flex flex-col md:flex-row w-full gap-4'>
            {/* Source and Destination */}
            <FlightSourceAndDestination formMethods={formMethods} />

            {/* Departure and Return Dates */}
            <FlightDepartureAndReturnDate formMethods={formMethods} />
          </div>

          {/* Passengers */}
          <FlightPassengers formMethods={formMethods} />

          {/* Cabin Class */}
          <FlightCabinClass formMethods={formMethods} />

          {/* Error Message */}
          {errorMessage && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg">
              <p className="text-red-800 dark:text-red-200">{errorMessage}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition duration-200"
          >
            {isLoading ? 'Searching Flights...' : 'Search Flights'}
          </button>
        </form>

        {/* Search Results */}
        <FlightResults searchResults={searchResults} />
      </div>
    </div>
  )
}
