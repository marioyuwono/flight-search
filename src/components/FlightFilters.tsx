'use client'

import { useMemo } from 'react'
import { iFlightFilter } from './Interfaces'
import { useAirportCache } from '@/contexts/AirportCacheContext'
import { getAirlineName } from '@/utils/chartDataProcessors'

export function FlightFilters({
	flights,
	filters,
	onFilterChange,
}: Readonly<{
	flights: any[]
	filters: iFlightFilter
	onFilterChange: (filters: iFlightFilter) => void
}>) {
	const { getAirport } = useAirportCache()
	// Calculate filter options from flight data
	const filterOptions = useMemo(() => {
		const airlines = new Set<string>()
		const prices: number[] = []
		const connectingAirports = new Set<string>()
		let maxDuration = 0

		flights.forEach((flight) => {
			// Extract airlines
			flight.itineraries?.[0]?.segments?.forEach((segment: any) => {
				if (segment.carrierCode) airlines.add(segment.carrierCode)
			})

			// Extract prices
			if (flight.price?.total) {
				prices.push(parseFloat(flight.price.total))
			}

			// Extract connecting airports and max duration
			const itinerary = flight.itineraries?.[0]
			if (itinerary) {
				// Parse duration (e.g., "PT6H35M" -> minutes)
				const durationMatch = itinerary.duration?.match(/PT(?:(\d+)H)?(?:(\d+)M)?/)
				if (durationMatch) {
					const hours = parseInt(durationMatch[1]) || 0
					const minutes = parseInt(durationMatch[2]) || 0
					const totalMinutes = hours * 60 + minutes
					maxDuration = Math.max(maxDuration, totalMinutes)
				}

				// Connecting airports are intermediate stops
				if (itinerary.segments && itinerary.segments.length > 1) {
					for (let i = 0; i < itinerary.segments.length - 1; i++) {
						connectingAirports.add(itinerary.segments[i].arrival.iataCode)
					}
				}
			}
		})

		const maxPrice = Math.max(...prices, 0)
		const minPrice = Math.min(...prices, 0)

		return {
			airlines: Array.from(airlines).sort(),
			priceRange: [minPrice, maxPrice] as [number, number],
			connectingAirports: Array.from(connectingAirports).sort(),
			maxDuration,
		}
	}, [flights])

	const handleStopsChange = (value: string) => {
		onFilterChange({
			...filters,
			stops: value as 'any' | 'nonstop' | 'one' | 'two',
		})
	}

	const handleAirlineChange = (airline: string) => {
		const updatedAirlines = filters.airlines.includes(airline)
			? filters.airlines.filter((a) => a !== airline)
			: [...filters.airlines, airline]
		onFilterChange({
			...filters,
			airlines: updatedAirlines,
		})
	}

	const handlePriceChange = (value: number[]) => {
		onFilterChange({
			...filters,
			priceRange: [value[0], value[1]] as [number, number],
		})
	}

	const handleDepartureTimeChange = (value: number[]) => {
		onFilterChange({
			...filters,
			departureTime: [value[0], value[1]] as [number, number],
		})
	}

	const handleArrivalTimeChange = (value: number[]) => {
		onFilterChange({
			...filters,
			arrivalTime: [value[0], value[1]] as [number, number],
		})
	}

	const handleConnectingAirportChange = (airport: string) => {
		const updatedAirports = filters.connectingAirports.includes(airport)
			? filters.connectingAirports.filter((a) => a !== airport)
			: [...filters.connectingAirports, airport]
		onFilterChange({
			...filters,
			connectingAirports: updatedAirports,
		})
	}

	const handleMaxDurationChange = (value: number) => {
		onFilterChange({
			...filters,
			maxDuration: value,
		})
	}

	const timeToDisplay = (minutes: number) => {
		const hours = Math.floor(minutes / 60)
		const mins = minutes % 60
		return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`
	}

	const durationToDisplay = (minutes: number) => {
		const hours = Math.floor(minutes / 60)
		const mins = minutes % 60
		return `${hours}h ${mins}m`
	}

	const handleResetFilters = () => {
		onFilterChange({
			stops: 'any',
			airlines: [],
			priceRange: [filterOptions.priceRange[0], filterOptions.priceRange[1]],
			departureTime: [0, 1440],
			arrivalTime: [0, 1440],
			connectingAirports: [],
			maxDuration: filterOptions.maxDuration,
		})
	}

	return (
		<div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 space-y-6">
			<div className="flex justify-between items-center">
				<h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h3>
				<button
					onClick={handleResetFilters}
					className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
				>
					Reset
				</button>
			</div>

			{/* Stops Filter */}
			<div>
				<h4 className="font-medium text-gray-900 dark:text-white mb-3">Stops</h4>
				<div className="space-y-2">
					{[
						{ value: 'any', label: 'Any number of stops' },
						{ value: 'nonstop', label: 'Nonstop only' },
						{ value: 'one', label: '1 stop or less' },
						{ value: 'two', label: '2 stops or less' },
					].map((option) => (
						<label key={option.value} className="flex items-center cursor-pointer">
							<input
								type="radio"
								name="stops"
								value={option.value}
								checked={filters.stops === option.value}
								onChange={(e) => handleStopsChange(e.target.value)}
								className="w-4 h-4 text-blue-600"
							/>
							<span className="ml-2 text-gray-700 dark:text-gray-300 text-sm">
								{option.label}
							</span>
						</label>
					))}
				</div>
			</div>

			{/* Airlines Filter */}
			{filterOptions.airlines.length > 0 && (
				<div>
					<h4 className="font-medium text-gray-900 dark:text-white mb-3">Airlines</h4>
					<div className="space-y-2 max-h-40 overflow-y-auto">
						{filterOptions.airlines.map((airline) => (
							<label key={airline} className="flex items-center cursor-pointer">
								<input
									type="checkbox"
									checked={filters.airlines.includes(airline)}
									onChange={() => handleAirlineChange(airline)}
									className="w-4 h-4 text-blue-600 rounded"
								/>
								<span className="ml-2 text-gray-700 dark:text-gray-300 text-sm">
									{getAirlineName(airline)}
								</span>
							</label>
						))}
					</div>
				</div>
			)}

			{/* Price Filter */}
			<div>
				<h4 className="font-medium text-gray-900 dark:text-white mb-3">
					Price: €{filters.priceRange[0].toFixed(2)} - €{filters.priceRange[1].toFixed(2)}
				</h4>
				<div className="space-y-2">
					<input
						type="range"
						min={filterOptions.priceRange[0]}
						max={filterOptions.priceRange[1]}
						value={filters.priceRange[0]}
						onChange={(e) =>
							handlePriceChange([
								parseFloat(e.target.value),
								filters.priceRange[1],
							])
						}
						className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
					/>
					<input
						type="range"
						min={filterOptions.priceRange[0]}
						max={filterOptions.priceRange[1]}
						value={filters.priceRange[1]}
						onChange={(e) =>
							handlePriceChange([
								filters.priceRange[0],
								parseFloat(e.target.value),
							])
						}
						className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
					/>
				</div>
			</div>

			{/* Departure Time Filter */}
			<div>
				<h4 className="font-medium text-gray-900 dark:text-white mb-3">
					Departure: {timeToDisplay(filters.departureTime[0])} -{' '}
					{timeToDisplay(filters.departureTime[1])}
				</h4>
				<div className="space-y-2">
					<input
						type="range"
						min="0"
						max="1440"
						value={filters.departureTime[0]}
						onChange={(e) =>
							handleDepartureTimeChange([
								parseInt(e.target.value),
								filters.departureTime[1],
							])
						}
						className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
					/>
					<input
						type="range"
						min="0"
						max="1440"
						value={filters.departureTime[1]}
						onChange={(e) =>
							handleDepartureTimeChange([
								filters.departureTime[0],
								parseInt(e.target.value),
							])
						}
						className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
					/>
				</div>
			</div>

			{/* Arrival Time Filter */}
			<div>
				<h4 className="font-medium text-gray-900 dark:text-white mb-3">
					Arrival: {timeToDisplay(filters.arrivalTime[0])} -{' '}
					{timeToDisplay(filters.arrivalTime[1])}
				</h4>
				<div className="space-y-2">
					<input
						type="range"
						min="0"
						max="1440"
						value={filters.arrivalTime[0]}
						onChange={(e) =>
							handleArrivalTimeChange([
								parseInt(e.target.value),
								filters.arrivalTime[1],
							])
						}
						className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
					/>
					<input
						type="range"
						min="0"
						max="1440"
						value={filters.arrivalTime[1]}
						onChange={(e) =>
							handleArrivalTimeChange([
								filters.arrivalTime[0],
								parseInt(e.target.value),
							])
						}
						className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
					/>
				</div>
			</div>

			{/* Connecting Airports Filter */}
			{filterOptions.connectingAirports.length > 0 && (
				<div>
					<h4 className="font-medium text-gray-900 dark:text-white mb-3">
						Connecting Airports
					</h4>
					<div className="space-y-2 max-h-40 overflow-y-auto">
						{filterOptions.connectingAirports.map((airport) => {
							const airportData = getAirport(airport)
							const displayName = `${airportData?.city ?? ''} ${airportData?.name ?? ''}`.trim() || airport
							return (
								<label key={airport} className="flex items-center cursor-pointer">
									<input
										type="checkbox"
										checked={filters.connectingAirports.includes(airport)}
										onChange={() => handleConnectingAirportChange(airport)}
										className="w-4 h-4 text-blue-600 rounded"
									/>
									<span className="ml-2 text-gray-700 dark:text-gray-300 text-sm">
										{displayName} {airport != displayName ? `(${airport})` : ''}
									</span>
								</label>
							)
						})}
					</div>
				</div>
			)}

			{/* Duration Filter */}
			<div>
				<h4 className="font-medium text-gray-900 dark:text-white mb-3">
					Max Duration: {durationToDisplay(filters.maxDuration)}
				</h4>
				<input
					type="range"
					min="0"
					max={filterOptions.maxDuration}
					value={filters.maxDuration}
					onChange={(e) => handleMaxDurationChange(parseInt(e.target.value))}
					className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
				/>
			</div>
		</div>
	)
}
