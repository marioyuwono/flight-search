import { iAmadeusResponseError, iFlightSearchRequest } from '@/components/Interfaces'
import { join, normalizeDateAsString } from '@/components/Methods'
import Amadeus from 'amadeus'
import { NextRequest, NextResponse } from 'next/server'

// Search flights using Amadeus API
async function searchFlights(params: iFlightSearchRequest): Promise<any> {
	const searchOption = {
		originLocationCode: params.source,
		destinationLocationCode: params.destination,
    departureDate: normalizeDateAsString(params.departureDate),
		adults: params.adults.toString(),
		children: params.children.toString(),
		infants: params.infants.toString(),
		travelClass: params.cabinClass || 'ECONOMY',
		nonStop: 'false',
		max: '50',
	}

	try {
		const amadeus = new Amadeus
		return amadeus.shopping.flightOffersSearch.get(searchOption)
	} catch (error: any) {
		console.error('Flight search error:', getError(error))
		throw getError(error)
	}
}

function getError(responseError: iAmadeusResponseError): string {
	return responseError?.description[0].title ?? responseError.code
}

export async function POST(request: NextRequest) {
	try {
		const body: iFlightSearchRequest = await request.json()

		// Validate required fields
    const required = {
      source: 'Point of Origin',
      destination: 'Destination',
      departureDate: 'Departure Date',
      returnDate: 'Return Date',
    }
    const missing: Array<string> = []
    Object.entries(required).forEach(([key, text]) => {
      if (!body[key as keyof iFlightSearchRequest]) {
        missing.push(text)
      }
    } )
		if (missing.length > 0) {
			return NextResponse.json({
				error: 'Missing required fields: ' + join(missing),
			}, { status: 400 })
		}

		// Validate dates
		const departureDate = new Date(body.departureDate)
		const today = new Date
		today.setHours(0, 0, 0, 0)

		if (departureDate < today) {
			return NextResponse.json({
				error: 'Departure date must be in the future',
			}, { status: 400 })
		}

		if (body.returnDate && body.tripType != 'oneway') {
			const returnDate = new Date(body.returnDate)
			if (returnDate < departureDate) {
				return NextResponse.json({
					error: 'Return date must be after departure date',
				}, { status: 400 })
			}
		}

		// Search for flights
		const results = await searchFlights(body)

		return NextResponse.json(results)
	} catch (error: any) {
		console.error('API error:', getError(error))
		return NextResponse.json({
      error: 'We’re experiencing a temporary issue fetching flight offers. Please try again later.',
		}, { status: 500 })
	}
}
