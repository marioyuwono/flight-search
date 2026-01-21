import { FieldErrors, UseFormRegister, UseFormWatch } from "react-hook-form"

export interface iAmadeusResponseError {
  description: Array<{
    status: number,
    code: number,
    title: string,
    detail: string,
    source: any
  }>,
  code: string
}

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
  departureDate: string
  returnDate: string
  adults: number
  children: number
  infants: number
  cabinClass: 'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST'// Amadeus API's cabin class
}

export interface iFlightSearchFormData extends iFlightSearchRequest {
}

export interface iFlightSearchForm {
  register: UseFormRegister<iFlightSearchFormData>
  watch: UseFormWatch<iFlightSearchFormData>
  errors: FieldErrors<iFlightSearchFormData>
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
