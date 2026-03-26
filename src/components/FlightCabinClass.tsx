import { IFlightSearchForm } from "../types/flight"

export function FlightCabinClass({ formMethods }: Readonly<IFlightSearchForm>) {
  const { register, watch, setValue, formState: { errors } } = formMethods
  return (
    <div>
      <div className="grid grid-cols-2 gap-3 md:flex md:justify-between md:w-full">
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
            <span className="ml-2 text-nowrap text-gray-700 dark:text-gray-300">
              {cabin.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  )
}
