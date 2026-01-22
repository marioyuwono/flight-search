  'use client'

  import { iAirport } from '@/components/Interfaces'
  import React, { createContext, useContext, useState, useCallback } from 'react'

  export type iAirportCache = Record<string, iAirport>

  interface iAirportCacheContext {
    cache: iAirportCache
    addAirports: (airports: iAirport[]) => void
    getAirport: (iataCode: string) => iAirport | undefined
    getCachedAirportDisplay: (iataCode: string) => string
  }

  const AirportCacheContext = createContext<iAirportCacheContext | undefined>(undefined)

  export function AirportCacheProvider({ children }: { children: React.ReactNode }) {
    const [cache, setCache] = useState<iAirportCache>({})

    const addAirports = useCallback((airports: iAirport[]) => {
      setCache((prevCache) => {
        const newCache = { ...prevCache }
        airports.forEach((airport) => {
          newCache[airport.iataCode] = airport
        })
        return newCache
      })
    }, [])

    const getAirport = useCallback(
      (iataCode: string): iAirport | undefined => {
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

    const value: iAirportCacheContext = {
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
