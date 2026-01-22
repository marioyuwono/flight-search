'use client'

import { useMemo } from 'react'
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts'
import { useAirportCache } from '@/contexts/AirportCacheContext'
import {
  getFlightAvailabilityBreakdown,
  getDepartureTimeDistribution,
  getTopDestinations,
  getAirlinesServingRoute,
  getFlightDurationDistribution,
  getAirlineName,
} from '@/utils/chartDataProcessors'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

interface FlightChartsProps {
  flights: any[]
  onChartFilterChange?: (filterType: string, value: string) => void
}

export function FlightCharts({
  flights,
  onChartFilterChange,
}: FlightChartsProps) {
  const { cache: airportCache } = useAirportCache()

  // Process data for all charts
  const availabilityData = useMemo(
    () => getFlightAvailabilityBreakdown(flights),
    [flights]
  )
  const departureTimeData = useMemo(
    () => getDepartureTimeDistribution(flights),
    [flights]
  )
  const destinationData = useMemo(
    () => getTopDestinations(flights, 8, airportCache),
    [flights, airportCache]
  )
  const airlineData = useMemo(() => getAirlinesServingRoute(flights), [flights])
  const durationData = useMemo(
    () => getFlightDurationDistribution(flights),
    [flights]
  )

  if (flights.length === 0) {
    return null
  }

  return (
    <>
      <div className="space-y-4">
        <Tips />

        {/* Flight Availability Breakdown - Pie Chart */}
        {availabilityData.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Flight Availability Breakdown
            </h4>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={availabilityData as any}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }: any) => `${name} ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {availabilityData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => `${value} flights`}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2 text-sm">
              {availabilityData.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded transition-colors"
                  onClick={() => onChartFilterChange?.('availability', item.name)}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: COLORS[idx % COLORS.length],
                      }}
                    />
                    <span className="text-gray-700 dark:text-gray-300">
                      {item.name}
                    </span>
                  </div>
                  <span className="text-gray-600 dark:text-gray-400">
                    {item.count} ({item.percentage}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Departure Time Distribution - Bar Chart */}
        {departureTimeData.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Departure Time Distribution
            </h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departureTimeData as any}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="timeRange"
                  style={{ fontSize: '12px' }}
                />
                <YAxis style={{ fontSize: '12px' }} />
                <Tooltip
                  formatter={(value: any) => `${value} flights`}
                  contentStyle={{
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    border: 'none',
                    borderRadius: '4px',
                    color: '#fff',
                  }}
                />
                <Bar
                  dataKey="count"
                  fill="#3b82f6"
                  radius={[8, 8, 0, 0]}
                  onClick={(data: any) =>
                    onChartFilterChange?.('departureTime', data.timeRange)
                  }
                  style={{ cursor: 'pointer' }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Top Destinations - Bar Chart */}
        {destinationData.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Top Destinations from This City
            </h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={destinationData as any}
                layout="vertical"
                margin={{ left: 200, right: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" style={{ fontSize: '12px' }} />
                <YAxis
                  dataKey="destinationName"
                  type="category"
                  width={190}
                  style={{ fontSize: '11px' }}
                />
                <Tooltip
                  formatter={(value: any) => `${value} flights`}
                  labelFormatter={(label: string) => {
                    const destination = destinationData.find(d => d.destinationName === label)
                    return destination?.destinationName || label
                  }}
                  contentStyle={{
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    border: 'none',
                    borderRadius: '4px',
                    color: '#fff',
                  }}
                />
                <Bar
                  dataKey="count"
                  fill="#10b981"
                  radius={[0, 8, 8, 0]}
                  onClick={(data: any) =>
                    onChartFilterChange?.('destination', data.destination)
                  }
                  style={{ cursor: 'pointer' }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Airlines Serving This Route - Bar Chart */}
        {airlineData.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Airlines Serving This Route
            </h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={airlineData as any}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="airline"
                  style={{ fontSize: '12px' }}
                />
                <YAxis style={{ fontSize: '12px' }} />
                <Tooltip
                  formatter={(value: any) => `${value} flights`}
                  labelFormatter={(label) => getAirlineName(label)}
                  contentStyle={{
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    border: 'none',
                    borderRadius: '4px',
                    color: '#fff',
                  }}
                />
                <Bar
                  dataKey="count"
                  fill="#f59e0b"
                  radius={[8, 8, 0, 0]}
                  onClick={(data: any) =>
                    onChartFilterChange?.('airline', data.airline)
                  }
                  style={{ cursor: 'pointer' }}
                />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2 text-sm max-h-48 overflow-y-auto">
              {airlineData.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded transition-colors"
                  onClick={() => onChartFilterChange?.('airline', item.airline)}
                >
                  <span className="text-gray-700 dark:text-gray-300">
                    {getAirlineName(item.airline)}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    {item.count} ({item.percentage}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Flight Duration Distribution - Bar Chart */}
        {durationData.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Flight Duration Distribution
            </h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={durationData as any}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="range"
                  style={{ fontSize: '12px' }}
                />
                <YAxis style={{ fontSize: '12px' }} />
                <Tooltip
                  formatter={(value: any) => `${value} flights`}
                  contentStyle={{
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    border: 'none',
                    borderRadius: '4px',
                    color: '#fff',
                  }}
                />
                <Bar
                  dataKey="count"
                  fill="#8b5cf6"
                  radius={[8, 8, 0, 0]}
                  onClick={(data: any) =>
                    onChartFilterChange?.('duration', data.range)
                  }
                  style={{ cursor: 'pointer' }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </>
  )
}

function Tips() {
  return (
    <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
      <p className="text-sm text-blue-800 dark:text-blue-200">
        💡 Tip: Click on chart elements to filter results by that category
      </p>
    </div>
  )
}
