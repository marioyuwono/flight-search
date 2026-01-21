'use client'
import { useEffect } from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { iFlightSearchForm } from "./Interfaces"

export function FlightDepartureAndReturnDate({ formMethods }: Readonly<iFlightSearchForm>) {
  const { register, setValue, watch, formState: { errors } } = formMethods
  const tripType = watch("tripType")
  const departureDate = watch("departureDate")
  const returnDate = watch("returnDate")

  useEffect(() => {
    register("departureDate", { required: "Departure date is required" })
    register("returnDate", { required: "Return date is required" })
  }, [register])

  if (tripType == 'oneway') {
    return (
      <div>
        <input
          type="date"
          {...register('departureDate', {
            required: 'Departure date is required',
          })}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {errors.departureDate && <p className="text-red-500 text-sm mt-1">{errors.departureDate.message}</p>}
      </div>
    )
  }

  return (
    <div>
      <DatePicker
        selected={departureDate}
        onChange={(dates: [Date | null, Date | null] | null) => {
          if (dates) {
            const [start, end] = dates
            if (start) {
              setValue("departureDate", start)
            }
            if (end) {
              setValue("returnDate", end)
            }
          }
        }}
        startDate={departureDate}
        endDate={returnDate}
        selectsRange
        placeholderText="Select departure and return"
        className="w-full px-4 py-2 border rounded-lg"
      />
      {errors.departureDate && <p className="text-red-500 text-sm mt-1">{errors.departureDate.message}</p>}
      {errors.returnDate && <p className="text-red-500 text-sm mt-1">{errors.returnDate.message}</p>}
    </div>
  )
}
