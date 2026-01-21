import { iFlightSearchForm } from "./Interfaces"
import { Counter } from "./Counter"

export function FlightPassengers({ formMethods }: Readonly<iFlightSearchForm>) {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      <Counter
        name="adults"
        label="Adults"
        min={1}
        max={9}
        formMethods={formMethods}
      />
      <Counter
        name="children"
        label="Children (Aged 2-11)"
        min={0}
        max={6}
        formMethods={formMethods}
      />
      <Counter
        name="infants"
        label="Infants"
        min={0}
        max={3}
        formMethods={formMethods}
      />
    </div>
  )
}
