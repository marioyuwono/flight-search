import { UseFormReturn } from "react-hook-form"

export interface iChartAirlineData {
  airline: string
  count: number
  percentage: number
}

export interface iChartAvailabilityData {
  name: string
  count: number
  percentage: number
}

export interface iChartDepartureTimeData {
  timeRange: string
  count: number
  percentage: number
}

export interface iChartDestinationData {
  destination: string
  destinationName?: string
  count: number
  percentage: number
}

export interface iChartDurationData {
  range: string
  count: number
  percentage: number
}

export interface iFlightSearchRequest {
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

export interface iFlightSearchFormData extends iFlightSearchRequest {
}

export interface iFlightSearchForm {
  formMethods: UseFormReturn<iFlightSearchFormData>
}

export interface iFlightFilter {
  stops: 'any' | 'nonstop' | 'one' | 'two'
  airlines: string[]
  priceRange: [number, number]
  departureTime: [number, number]
  arrivalTime: [number, number]
  connectingAirports: string[]
  maxDuration: number
}
