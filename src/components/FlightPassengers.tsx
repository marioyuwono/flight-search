import { iFlightSearchForm } from "./Interfaces"

export function FlightPassengers({ formMethods }: Readonly<iFlightSearchForm>) {
  const { register, watch, setValue, formState: { errors } } = formMethods
  return (
    <div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
            Adults
          </label>
          <select
            {...register('adults', { valueAsNumber: true })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
            Children
          </label>
          <select
            {...register('children', { valueAsNumber: true })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {[0, 1, 2, 3, 4, 5, 6].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
            Infants
          </label>
          <select
            {...register('infants', { valueAsNumber: true })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {[0, 1, 2, 3].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}