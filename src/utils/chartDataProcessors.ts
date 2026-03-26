import { iChartAirlineData, iChartAvailabilityData, iChartDepartureTimeData, iChartDestinationData, iChartDurationData } from "@/components/Interfaces"
import { IAirportCache } from "@/types/airport"

/**
 * Process flight availability data (direct vs connecting flights)
 */
export function getFlightAvailabilityBreakdown(flights: any[]): iChartAvailabilityData[] {
  if (!flights || flights.length === 0) {
    return []
  }

  const directFlights = flights.filter((f) => {
    const segments = f.itineraries?.[0]?.segments || []
    return segments.length === 1
  })

  const connectingFlights = flights.filter((f) => {
    const segments = f.itineraries?.[0]?.segments || []
    return segments.length > 1
  })

  const oneStop = connectingFlights.filter((f) => {
    const segments = f.itineraries?.[0]?.segments || []
    return segments.length === 2
  })

  const twoOrMoreStops = connectingFlights.filter((f) => {
    const segments = f.itineraries?.[0]?.segments || []
    return segments.length > 2
  })

  const data = [
    { name: 'Direct', count: directFlights.length },
    { name: 'One Stop', count: oneStop.length },
    { name: '2+ Stops', count: twoOrMoreStops.length },
  ].filter((d) => d.count > 0)

  const total = flights.length
  return data.map((d) => ({
    ...d,
    percentage: Math.round((d.count / total) * 100),
  }))
}

/**
 * Process departure time distribution data
 */
export function getDepartureTimeDistribution(flights: any[]): iChartDepartureTimeData[] {
  if (!flights || flights.length === 0) {
    return []
  }

  const timeRanges: Record<string, number> = {
    '00:00-06:00': 0,
    '06:00-12:00': 0,
    '12:00-18:00': 0,
    '18:00-24:00': 0,
  }

  flights.forEach((flight) => {
    const departureTime = flight.itineraries?.[0]?.segments?.[0]?.departure?.at
    if (departureTime) {
      const date = new Date(departureTime)
      const hours = date.getHours()

      if (hours >= 0 && hours < 6) timeRanges['00:00-06:00']++
      else if (hours >= 6 && hours < 12) timeRanges['06:00-12:00']++
      else if (hours >= 12 && hours < 18) timeRanges['12:00-18:00']++
      else timeRanges['18:00-24:00']++
    }
  })

  const data = Object.entries(timeRanges)
    .map(([range, count]) => ({ timeRange: range, count }))
    .filter((d) => d.count > 0)

  const total = flights.length
  return data.map((d) => ({
    ...d,
    percentage: Math.round((d.count / total) * 100),
  }))
}

/**
 * Get top destinations from a city
 */
export function getTopDestinations(flights: any[], limit = 10, airportCache: IAirportCache = {}): iChartDestinationData[] {
  if (!flights || flights.length === 0) {
    return []
  }

  const destinationMap: Record<string, number> = {}

  flights.forEach((flight) => {
    const destination = flight.itineraries?.[0]?.segments?.[flight.itineraries[0].segments.length - 1]?.arrival?.iataCode
    if (destination) {
      destinationMap[destination] = (destinationMap[destination] || 0) + 1
    }
  })

  const data = Object.entries(destinationMap)
    .map(([dest, count]: [string, number]) => ({ 
      destination: dest, 
      destinationName: airportCache[dest]?.name || dest,
      count 
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)

  const total = flights.length
  return data.map((d) => ({
    ...d,
    percentage: Math.round((d.count / total) * 100),
  }))
}

/**
 * Get airlines serving a route
 */
export function getAirlinesServingRoute(flights: any[]): iChartAirlineData[] {
  if (!flights || flights.length === 0) {
    return []
  }

  const airlineMap: Record<string, number> = {}

  flights.forEach((flight) => {
    const segments = flight.itineraries?.[0]?.segments || []
    const airlines = new Set<string>()
    segments.forEach((seg: any) => {
      if (seg.carrierCode) {
        airlines.add(seg.carrierCode)
      }
    })
    airlines.forEach((airline) => {
      airlineMap[airline] = (airlineMap[airline] || 0) + 1
    })
  })

  const data = Object.entries(airlineMap)
    .map(([airline, count]) => ({ airline, count }))
    .sort((a, b) => b.count - a.count)

  const total = flights.length
  return data.map((d) => ({
    ...d,
    percentage: Math.round((d.count / total) * 100),
  }))
}

/**
 * Get flight duration distribution
 */
export function getFlightDurationDistribution(flights: any[]): iChartDurationData[] {
  if (!flights || flights.length === 0) {
    return []
  }

  const durationRanges: Record<string, number> = {
    '0-3h': 0,
    '3-6h': 0,
    '6-12h': 0,
    '12h+': 0,
  }

  flights.forEach((flight) => {
    const duration = flight.itineraries?.[0]?.duration
    if (duration) {
      const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/)
      if (match) {
        const hours = parseInt(match[1]) || 0
        const minutes = parseInt(match[2]) || 0
        const totalMinutes = hours * 60 + minutes

        if (totalMinutes < 180) durationRanges['0-3h']++
        else if (totalMinutes < 360) durationRanges['3-6h']++
        else if (totalMinutes < 720) durationRanges['6-12h']++
        else durationRanges['12h+']++
      }
    }
  })

  const data = Object.entries(durationRanges)
    .map(([range, count]) => ({ range, count }))
    .filter((d) => d.count > 0)

  const total = flights.length
  return data.map((d) => ({
    ...d,
    percentage: Math.round((d.count / total) * 100),
  }))
}

/**
 * Get airline name from carrier code (common airlines)
 */
export function getAirlineName(code: string): string {
  // TODO
  const airlineNames: Record<string, string> = {
    AA: 'American Airlines',
    BA: 'British Airways',
    DL: 'Delta Air Lines',
    LH: 'Lufthansa',
    AF: 'Air France',
    KL: 'KLM Royal Dutch',
    UA: 'United Airlines',
    AC: 'Air Canada',
    SQ: 'Singapore Airlines',
    QF: 'Qantas Airways',
    NZ: 'Air New Zealand',
    EK: 'Emirates',
    QR: 'Qatar Airways',
    AE: 'LATAM Airlines',
    IB: 'Iberia',
    LX: 'Swiss International',
    OS: 'Austrian Airlines',
    TK: 'Turkish Airlines',
    EY: 'Etihad Airways',
    G3: 'Gol',
    AS: 'Alaska Air',
    B6: 'JetBlue',
    NK: 'Spirit Airlines',
    F9: 'Frontier Airlines',
  }
  return airlineNames[code] || code
}
