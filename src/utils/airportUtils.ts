import { iAirport, iAirportCache } from '@/components/Interfaces'

// In-memory cache for airports during the session
const airportCache: iAirportCache = {}

export async function getAirportInfo(iataCode: string): Promise<iAirport | null> {
  if (!iataCode) return null

  // Return from cache if available
  if (airportCache[iataCode]) {
    return airportCache[iataCode]
  }

  try {
    const response = await fetch(`/api/airports/search?query=${encodeURIComponent(iataCode)}`)
    if (!response.ok) return null

    const data = await response.json()
    if (data.data && data.data.length > 0) {
      const airport = data.data[0]
      // Cache the result
      airportCache[iataCode] = airport
      return airport
    }
  } catch (error) {
    console.error(`Failed to fetch airport info for ${iataCode}:`, error)
  }

  return null
}

export function getAirportDisplay(iataCode: string, cached: iAirportCache = {}): string {
  if (!iataCode) return ''

  const airport = cached[iataCode]
  if (airport) {
    return `${airport.iataCode} - ${airport.name}, ${airport.city}`
  }

  // Fallback to just the code if no cached data
  return iataCode
}

export function getCachedAirportDisplay(iataCode: string): string {
  if (!iataCode) return ''
  const airport = airportCache[iataCode]
  if (airport) {
    return `${airport.iataCode} - ${airport.name}, ${airport.city}`
  }
  return iataCode
}
