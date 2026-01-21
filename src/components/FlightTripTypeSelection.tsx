import { iFlightSearchForm } from "./Interfaces"

export function FlightTripTypeSelection({ formMethods }: Readonly<iFlightSearchForm>) {
  const { register, watch, setValue, formState: { errors } } = formMethods

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {['roundtrip', 'oneway'].map((type) => (
        <label key={type} className="flex items-center cursor-pointer">
          <input
            type="radio"
            value={type}
            {...register('tripType')}
            className="w-4 h-4 text-blue-600"
          />
          <span className="ml-2 text-nowrap text-gray-700 dark:text-gray-300 capitalize">
            {type === 'roundtrip' ? 'Round Trip' : type === 'oneway' ? 'One Way' : 'Multi-City'}
          </span>
        </label>
      ))}
    </div>
  )
}
