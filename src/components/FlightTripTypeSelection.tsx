import { iFlightSearchForm } from "./Interfaces"

export function FlightTripTypeSelection({
  register,
  watch,
  errors,
}: Readonly<iFlightSearchForm>) {
  
  return (
	<div>
	  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
		Trip Type
	  </label>
	  <div className="grid grid-cols-3 gap-4">
		{['roundtrip', 'oneway'].map((type) => (
		  <label key={type} className="flex items-center cursor-pointer">
			<input
			  type="radio"
			  value={type}
			  {...register('tripType')}
			  className="w-4 h-4 text-blue-600"
			/>
			<span className="ml-2 text-gray-700 dark:text-gray-300 capitalize">
			  {type === 'roundtrip' ? 'Round Trip' : type === 'oneway' ? 'One Way' : 'Multi-City'}
			</span>
		  </label>
		))}
	  </div>
	</div>
  )
}
