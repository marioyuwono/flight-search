import { iFlightSearchForm } from "./Interfaces"

export function FlightCabinClass({
  register,
  watch,
  errors,
}: Readonly<iFlightSearchForm>) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
        Cabin Class
      </label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { value: 'ECONOMY', label: 'Economy' },
          { value: 'PREMIUM_ECONOMY', label: 'Premium Economy' },
          { value: 'BUSINESS', label: 'Business' },
          { value: 'FIRST', label: 'First' },
        ].map((cabin) => (
          <label key={cabin.value} className="flex items-center cursor-pointer">
            <input
              type="radio"
              value={cabin.value}
              {...register('cabinClass')}
              className="w-4 h-4 text-blue-600"
            />
            <span className="ml-2 text-gray-700 dark:text-gray-300">
              {cabin.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  )
}
