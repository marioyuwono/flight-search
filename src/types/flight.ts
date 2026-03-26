import { UseFormReturn } from "react-hook-form"

export interface IFlightSearchRequest {
  tripType: 'roundtrip' | 'oneway' | 'multicity'
  source: string
  destination: string
  departureDate: Date
  returnDate: Date
  adults: number
  children: number
  infants: number
  cabinClass: 'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST'// Amadeus API's cabin class
}

export interface IFlightSearchFormData extends IFlightSearchRequest {
}

export interface IFlightSearchForm {
  formMethods: UseFormReturn<IFlightSearchFormData>
}

export interface IFlightFilter {
  stops: 'any' | 'nonstop' | 'one' | 'two'
  airlines: string[]
  priceRange: [number, number]
  departureTime: [number, number]
  arrivalTime: [number, number]
  connectingAirports: string[]
  maxDuration: number
}
