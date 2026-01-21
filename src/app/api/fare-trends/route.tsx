import { iFlightSearchRequest } from '@/components/Interfaces'
import Amadeus from 'amadeus'
import { NextRequest, NextResponse } from 'next/server'

interface iFareTrendData {
  date: string
  price: number
  departureDate: string
}

// Fetch fare trends using Amadeus API
async function getAirFareTrends(params: iFlightSearchRequest): Promise<iFareTrendData[]> {
  try {
    const amadeus = new Amadeus()

    // amadeus.travel.analytics.fares.get() provides fare recommendations
    // This gives us historical price trends for the route
    const response = await amadeus.travel.analytics.fares.get({
      origin: params.source,
      destination: params.destination,
      departureDate: params.departureDate,
    })

    // Transform the response into chart-friendly data
    if (response?.data) {
      return response.data.map((fare: any) => ({
        date: fare.departureDate || params.departureDate,
        price: parseFloat(fare.price) || 0,
        departureDate: params.departureDate,
      }))
    }

    return []
  } catch (error: any) {
    console.error('Fare trends error:', error)
    // Return mock data if API fails (for development)
    return generateMockFareTrends(params)
  }
}

// Generate mock fare trend data for testing
function generateMockFareTrends(params: iFlightSearchRequest): iFareTrendData[] {
  const trendData: iFareTrendData[] = []
  const basePrice = 150 + Math.random() * 100

  // Generate trend data for 30 days before departure
  const depDate = new Date(params.departureDate)
  for (let i = 30; i >= 0; i--) {
    const date = new Date(depDate)
    date.setDate(date.getDate() - i)

    // Simulate price trend with some volatility
    const volatility = Math.sin(i / 5) * 20 + Math.cos(i / 10) * 15
    const price = basePrice + volatility + Math.random() * 10

    trendData.push({
      date: date.toISOString().split('T')[0],
      price: Math.round(price * 100) / 100,
      departureDate: params.departureDate,
    })
  }

  return trendData
}

export async function POST(request: NextRequest) {
  try {
    const body: iFlightSearchRequest = await request.json()

    // Validate required fields
    if (!body.source || !body.destination || !body.departureDate) {
      return NextResponse.json({
        error: 'Missing required fields: source, destination, and departureDate',
      }, { status: 400 })
    }

    const trends = await getAirFareTrends(body)
    return NextResponse.json({ data: trends })
  } catch (error) {
    console.error('API error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch fare trends'

    return NextResponse.json({
      error: errorMessage,
    }, { status: 500 })
  }
}
