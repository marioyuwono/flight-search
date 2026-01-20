export interface FlightSearchRequest {
  tripType: 'roundtrip' | 'oneway' | 'multicity'
  source: string
  destination: string
  departureDate: string
  returnDate: string
  adults: number
  children: number
  infants: number
  cabinClass: 'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST'// Amadeus API's cabin class
}

export interface FlightSearchFormData extends FlightSearchRequest {
}

export interface AmadeusResponseError {
  description: Array<{
    status: number,
    code: number,
    title: string,
    detail: string,
    source: any
  }>,
  code: string
}