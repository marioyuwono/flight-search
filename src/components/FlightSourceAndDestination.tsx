import { PlaneLandingIcon, PlaneTakeoffIcon } from "./Icons"
import { iFlightSearchForm } from "./Interfaces"
import { ArrowsRightLeftIcon, MapPinIcon } from "@heroicons/react/24/solid"

export function FlightSourceAndDestination({ formMethods }: Readonly<iFlightSearchForm>) {
  const { register, watch, setValue, formState: { errors } } = formMethods
  const source = watch("source")
  const destination = watch("destination")

  const handleSwap = () => {
    setValue("source", destination)
    setValue("destination", source)
  }

  return (
    <div className="relative flex flex-row gap-4">
      {/* Source */}
      <div className="flex-1 w-full">
        <input
          type="text"
          placeholder="e.g., JFK"
          {...register("source", {
            required: "Source airport is required",
            pattern: {
              value: /^[A-Z]{3}$/,
              message: "Please enter a valid 3-letter airport code",
            },
          })}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {errors.source && (
          <p className="text-red-500 text-sm mt-1">{errors.source.message}</p>
        )}
      </div>

      {/* Swap Button */}
      <button
        type="button"
        onClick={handleSwap}
        className="absolute left-1/2 -translate-x-1/2 md:translate-y-0 md:p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition">
        <ArrowsRightLeftIcon className="h-6 w-6 text-gray-700 dark:text-gray-200" />
      </button>

      {/* Destination */}
      <div className="flex-1 w-full">
        <input
          type="text"
          placeholder="e.g., LAX"
          {...register("destination", {
            required: "Destination airport is required",
            pattern: {
              value: /^[A-Z]{3}$/,
              message: "Please enter a valid 3-letter airport code",
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
