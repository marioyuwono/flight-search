import { MinusIcon, PlusIcon } from "@heroicons/react/24/solid"
import { ChangeEvent, FC } from "react"
import { UseFormReturn } from "react-hook-form"

interface ICounterProps {
  name: string
  label: string
  min?: number
  max?: number
  formMethods: UseFormReturn<any>
}

export const Counter: FC<ICounterProps> = ({
  name,
  label,
  min = 0,
  max = 9,
  formMethods,
}) => {
  const { watch, setValue } = formMethods
  const value = watch(name) ?? min

  const increment = () => {
    if (value < max) setValue(name, value + 1)
  }

  const decrement = () => {
    if (value > min) setValue(name, value - 1)
  }

  const update = (e: ChangeEvent<HTMLInputElement>) => {
    const newVal = Number(e.target.value)
    if (!isNaN(newVal)) {
      // clamp between min and max 
      const clamped = Math.max(min, Math.min(max, newVal))
      setValue(name, clamped)
    }
  }

  return (
    <div>
      <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
        {label}
      </label>
      <div className="flex items-center">
        <input
          type="number"
          value={value}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          onChange={update}
        />
        <button
          type="button"
          onClick={decrement}
          className="ml-2 px-3 py-2 text-gray-700 dark:text-white hover:bg-gray-200 hover:text-blue-500 dark:hover:bg-gray-700 rounded-lg"
        >
          <MinusIcon className="size-4" />
        </button>
        <button
          type="button"
          onClick={increment}
          className="ml-2 px-3 py-2 text-gray-700 dark:text-white hover:bg-gray-200 hover:text-blue-500 dark:hover:bg-gray-700 rounded-lg"
        >
          <PlusIcon className="size-4" />
        </button>
      </div>
    </div>
  )
}
