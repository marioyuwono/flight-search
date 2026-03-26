import { NextRequest, NextResponse } from 'next/server'
import Amadeus from 'amadeus'

interface AirportData {
  iataCode: string
  name: string
  city: string
  country: string
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('query')

  if (!query || query.length < 1) {
    return NextResponse.json(
      { error: 'Query parameter is required' },
      { status: 400 }
    )
  }

  try {
    const amadeus = new Amadeus()
    const response = await amadeus.referenceData.locations.get({
      keyword: query,
      subType: 'AIRPORT',
      'page[limit]': '10',
    })

    // Transform the response to include relevant airport information
    const airports: AirportData[] = (response.data || []).map((airport: any) => ({
      iataCode: airport.iataCode,
      name: airport.name,
      city: airport.address?.cityName || '',
      country: airport.address?.countryName || '',
    }))

    return NextResponse.json({ data: airports })
  } catch (error) {
    console.error('Airport search error:', error)
    return NextResponse.json(
      { error: 'Failed to search airports' },
      { status: 500 }
    )
  }
}
