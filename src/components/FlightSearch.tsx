'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { FlightSearchFormData } from './Interfaces'


export function FlightSearch() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FlightSearchFormData>({
    defaultValues: {
      tripType: 'roundtrip',
      adults: 1,
      children: 0,
      infants: 0,
      cabinClass: 'ECONOMY',
    },
  })

  const [isLoading, setIsLoading] = useState(false)
  const [searchResults, setSearchResults] = useState<any>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const tripType = watch('tripType')

  const onSubmit = async (data: FlightSearchFormData) => {
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
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-6 md:p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Search Flights
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Trip Type Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Trip Type
            </label>
            <div className="grid grid-cols-3 gap-4">
              {['roundtrip', 'oneway', 'multicity'].map((type) => (
                <label key={type} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    value={type}
                    {...register('tripType')}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="ml-2 text-gray-700 dark:text-gray-300 capitalize">
                    {type === 'roundtrip' ? 'Round Trip' : type === 'oneway' ? 'One Way' : 'Multi-City'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Source and Destination */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                From (Source)
              </label>
              <input
                type="text"
                placeholder="e.g., JFK, NYC"
                {...register('source', {
                  required: 'Source airport is required',
                  pattern: {
                    value: /^[A-Z]{3}$/,
                    message: 'Please enter a valid 3-letter airport code',
                  },
                })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.source && (
                <p className="text-red-500 text-sm mt-1">{errors.source.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                To (Destination)
              </label>
              <input
                type="text"
                placeholder="e.g., LAX, LOS"
                {...register('destination', {
                  required: 'Destination airport is required',
                  pattern: {
                    value: /^[A-Z]{3}$/,
                    message: 'Please enter a valid 3-letter airport code',
                  },
                })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.destination && (
                <p className="text-red-500 text-sm mt-1">{errors.destination.message}</p>
              )}
            </div>
          </div>

          {/* Departure and Return Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Departure Date
              </label>
              <input
                type="date"
                {...register('departureDate', {
                  required: 'Departure date is required',
                })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.departureDate && (
                <p className="text-red-500 text-sm mt-1">{errors.departureDate.message}</p>
              )}
            </div>

            {(tripType === 'roundtrip' || tripType === 'multicity') && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Return Date
                </label>
                <input
                  type="date"
                  {...register('returnDate', {
                    required: 'Return date is required',
                  })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.returnDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.returnDate.message}</p>
                )}
              </div>
            )}
          </div>

          {/* Passengers */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Passengers
            </label>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                  Adults
                </label>
                <select
                  {...register('adults', { valueAsNumber: true })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                  Children
                </label>
                <select
                  {...register('children', { valueAsNumber: true })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {[0, 1, 2, 3, 4, 5, 6].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                  Infants
                </label>
                <select
                  {...register('infants', { valueAsNumber: true })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {[0, 1, 2, 3].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Cabin Class */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Cabin Class
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { value: 'ECONOMY', label: 'Economy' },
                { value: 'PREMIUM_ECONOMY', label: 'Premium Economy' },
                { value: 'BUSINESS', label: 'Business' },
                { value: 'FIRST', label: 'First' },
              ].map((cabin) => (
                <label key={cabin.value} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    value={cabin.value}
                    {...register('cabinClass')}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="ml-2 text-gray-700 dark:text-gray-300">
                    {cabin.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

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
        {searchResults && (
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
                  {searchResults.data.slice(0, 5).map((flight: any, index: number) => (
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
        )}
      </div>
    </div>
  )
}
