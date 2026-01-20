import { iFlightSearchForm } from "./Interfaces"

export function FlightSourceAndDestination({
  register,
  watch,
  errors,
}: Readonly<iFlightSearchForm>) {
  return (
	<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
	  <div>
		<label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
		  From (Source)
		</label>
		<input
		  type="text"
		  placeholder="e.g., JFK, NYC"
		  {...register('source', {
			required: 'Source airport is required',
			pattern: {
			  value: /^[A-Z]{3}$/,
			  message: 'Please enter a valid 3-letter airport code',
			},
		  })}
		  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
		/>
		{errors.source && (
		  <p className="text-red-500 text-sm mt-1">{errors.source.message}</p>
		)}
	  </div>

	  <div>
		<label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
		  To (Destination)
		</label>
		<input
		  type="text"
		  placeholder="e.g., LAX, LOS"
		  {...register('destination', {
			required: 'Destination airport is required',
			pattern: {
			  value: /^[A-Z]{3}$/,
			  message: 'Please enter a valid 3-letter airport code',
			},
		  })}
		  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
		/>
		{errors.destination && (
		  <p className="text-red-500 text-sm mt-1">{errors.destination.message}</p>
		)}
	  </div>
	</div>
  )
}
