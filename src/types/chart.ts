
export interface IChartAirlineData {
  airline: string
  count: number
  percentage: number
}

export interface IChartAvailabilityData {
  name: string
  count: number
  percentage: number
}

export interface IChartDepartureTimeData {
  timeRange: string
  count: number
  percentage: number
}

export interface IChartDestinationData {
  destination: string
  destinationName?: string
  count: number
  percentage: number
}

export interface IChartDurationData {
  range: string
  count: number
  percentage: number
}
