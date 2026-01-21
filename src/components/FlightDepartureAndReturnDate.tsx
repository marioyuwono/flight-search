import { iFlightSearchForm } from "./Interfaces"

export function FlightDepartureAndReturnDate({ formMethods }: Readonly<iFlightSearchForm>) {
  const { register, watch, setValue, formState: { errors } } = formMethods
  const tripType = watch('tripType')
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <input
          type="date"
          {...register('departureDate', {
            required: 'Departure date is required',
          })}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {errors.departureDate && (
          <p className="text-red-500 text-sm mt-1">{errors.departureDate.message}</p>
        )}
      </div>

      {(tripType === 'roundtrip' || tripType === 'multicity') && (
        <div>
          <input
            type="date"
            {...register('returnDate', {
              required: 'Return date is required',
            })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.returnDate && (
            <p className="text-red-500 text-sm mt-1">{errors.returnDate.message}</p>
          )}
        </div>
      )}
    </div>
  )
}