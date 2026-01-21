'use client'

import { MapPinIcon } from "@heroicons/react/24/solid"
import { useEffect, useRef, useState } from "react"
import { UseFormReturn } from "react-hook-form"
import { iFlightSearchFormData } from "./Interfaces"

interface Airport {
  iataCode: string
  name: string
  city: string
  country: string
}

export function AirportSearch({
  fieldName,
  formMethods,
  placeholder,
}: {
  fieldName: "source" | "destination"
  formMethods: UseFormReturn<iFlightSearchFormData>
  placeholder: string
}) {
  const { register, watch, setValue, formState: { errors } } = formMethods
  const [input, setInput] = useState("")
  const [airports, setAirports] = useState<Airport[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const fieldValue = watch(fieldName)

  // Search airports as user types
  useEffect(() => {
    const searchAirports = async () => {
      if (input.length < 1) {
        setAirports([])
        setIsOpen(false)
        return
      }

      setIsLoading(true)
      try {
        const response = await fetch(
          `/api/airports/search?query=${encodeURIComponent(input)}`
        )
        if (!response.ok) throw new Error("Failed to search airports")
        const data = await response.json()
        setAirports(data.data || [])
        setIsOpen(data.data && data.data.length > 0)
      } catch (error) {
        console.error("Airport search error:", error)
        setAirports([])
      } finally {
        setIsLoading(false)
      }
    }

    const debounceTimer = setTimeout(searchAirports, 300)
    return () => clearTimeout(debounceTimer)
  }, [input])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Update input when field value changes (e.g., on swap)
  useEffect(() => {
    if (fieldValue && fieldValue !== input) {
      setInput(fieldValue)
    }
  }, [fieldValue])

  const handleSelectAirport = (airport: Airport) => {
    setValue(fieldName, airport.iataCode)
    setInput(airport.iataCode)
    setIsOpen(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase()
    setInput(value)
    setValue(fieldName, value) // Update form value with current input
  }

  const formatAirportDisplay = (airport: Airport) => {
    return `${airport.iataCode} - ${airport.name}, ${airport.city}`
  }

  return (
    <div className="relative flex-1 w-full" ref={dropdownRef}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleInputChange}
          onFocus={() => input.length > 0 && airports.length > 0 && setIsOpen(true)}
          placeholder={placeholder}
          className="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full" />
          </div>
        )}
      </div>

      {/* Dropdown list */}
      {isOpen && airports.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
          {airports.map((airport) => (
            <button
              key={airport.iataCode}
              type="button"
              onClick={() => handleSelectAirport(airport)}
              className="w-full text-left px-4 py-2 hover:bg-blue-50 dark:hover:bg-slate-700 border-b border-gray-200 dark:border-gray-700 last:border-b-0 transition"
            >
              <div className="font-medium text-gray-900 dark:text-white">
                {airport.iataCode}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {airport.name}, {airport.city} • {airport.country}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Error message */}
      {errors[fieldName] && (
        <p className="text-red-500 text-sm mt-1">
          {errors[fieldName]?.message as string}
        </p>
      )}
    </div>
  )
}
