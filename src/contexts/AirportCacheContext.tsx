  'use client'

  import { IAirport } from "@/types/airport"
  import React, { createContext, useContext, useState, useCallback } from 'react'

  export type IAirportCache = Record<string, IAirport>

  interface IAirportCacheContext {
    cache: IAirportCache
    addAirports: (airports: IAirport[]) => void
    getAirport: (iataCode: string) => IAirport | undefined
    getCachedAirportDisplay: (iataCode: string) => string
  }

  const AirportCacheContext = createContext<IAirportCacheContext | undefined>(undefined)

  export function AirportCacheProvider({ children }: { children: React.ReactNode }) {
    const [cache, setCache] = useState<IAirportCache>({})

    const addAirports = useCallback((airports: IAirport[]) => {
      setCache((prevCache) => {
        const newCache = { ...prevCache }
        airports.forEach((airport) => {
          newCache[airport.iataCode] = airport
        })
        return newCache
      })
    }, [])

    const getAirport = useCallback(
      (iataCode: string): IAirport | undefined => {
        return cache[iataCode]
      },
      [cache]
    )

    const getCachedAirportDisplay = useCallback(
      (iataCode: string): string => {
        const airport = cache[iataCode]
        if (airport) {
          return `${airport.iataCode} - ${airport.name}, ${airport.city}`
        }
        return iataCode
      },
      [cache]
    )

    const value: IAirportCacheContext = {
      cache,
      addAirports,
      getAirport,
      getCachedAirportDisplay,
    }

    return (
      <AirportCacheContext.Provider value={value}>
        {children}
      </AirportCacheContext.Provider>
    )
  }

  export function useAirportCache() {
    const context = useContext(AirportCacheContext)
    if (context === undefined) {
      throw new Error('useAirportCache must be used within AirportCacheProvider')
    }
    return context
  }
