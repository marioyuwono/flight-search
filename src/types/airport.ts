
export interface IAirport {
  iataCode: string
  name: string
  city: string
  country: string
}

export interface IAirportCache {
  [key: string]: IAirport // key is iataCode
}
