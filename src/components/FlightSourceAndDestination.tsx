import { ArrowsRightLeftIcon } from "@heroicons/react/24/solid"
import { iFlightSearchForm } from "./Interfaces"
import { AirportSearch } from "./AirportSearch"

export function FlightSourceAndDestination({ formMethods }: Readonly<iFlightSearchForm>) {
  const { watch, setValue } = formMethods
  const source = watch("source")
  const destination = watch("destination")

  const handleSwap = () => {
    setValue("source", destination)
    setValue("destination", source)
  }

  return (
    <div className="relative flex flex-row flex-1 gap-4">
      {/* Source Airport Search */}
      <AirportSearch
        fieldName="source"
        formMethods={formMethods}
        placeholder="Search by code, city, or airport name"
      />

      {/* Swap Button */}
      <button
        type="button"
        onClick={handleSwap}
        className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 md:p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition z-40">
        <ArrowsRightLeftIcon className="h-6 w-6 text-gray-700 dark:text-gray-200" />
      </button>

      {/* Destination Airport Search */}
      <AirportSearch
        fieldName="destination"
        formMethods={formMethods}
        placeholder="Search by code, city, or airport name"
      />
    </div>
  )
}
