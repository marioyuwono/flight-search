'use client'

import * as d3 from 'd3'
import { useEffect, useRef, useState } from 'react'
import { iFlightFareTrendData } from './Interfaces'

interface PriceTrendChartProps {
  data: iFlightFareTrendData[]
  onDateSelect?: (date: string | null) => void
  isLoading?: boolean
}

export function FlightPriceTrendChart({
  data,
  onDateSelect,
  isLoading = false,
}: PriceTrendChartProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  useEffect(() => {
    if (!data || data.length === 0 || !svgRef.current) return

    // Set dimensions
    const margin = { top: 20, right: 30, bottom: 30, left: 60 }
    const width = 800 - margin.left - margin.right
    const height = 300 - margin.top - margin.bottom

    // Sort data by date
    const sortedData = [...data].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    )

    // Create scales
    const xScale = d3
      .scaleTime()
      .domain(d3.extent(sortedData, (d: iFlightFareTrendData) => new Date(d.date)) as [Date, Date])
      .range([0, width])

    const yScale = d3
      .scaleLinear()
      .domain([
        d3.min(sortedData, (d: iFlightFareTrendData) => d.price) as number,
        d3.max(sortedData, (d: iFlightFareTrendData) => d.price) as number,
      ])
      .range([height, 0])

    // Create line generator
    const line = d3
      .line<iFlightFareTrendData>()
      .x((d: iFlightFareTrendData) => xScale(new Date(d.date)))
      .y((d: iFlightFareTrendData) => yScale(d.price))

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove()

    // Create SVG
    const svg = d3
      .select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    // Add grid lines
    svg
      .append('g')
      .attr('class', 'grid')
      .attr('opacity', 0.1)
      .call(
        d3
          .axisLeft(yScale)
          .tickSize(-width)
          .tickFormat(() => '')
      )

    // Add X axis
    svg
      .append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale).ticks(d3.timeDay.every(5)))
      .append('text')
      .attr('x', width / 2)
      .attr('y', 40)
      .attr('fill', 'currentColor')
      .style('text-anchor', 'middle')
      .text('Date')

    // Add Y axis
    svg
      .append('g')
      .call(d3.axisLeft(yScale))
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - height / 2)
      .attr('dy', '1em')
      .attr('fill', 'currentColor')
      .style('text-anchor', 'middle')
      .text('Price (USD)')

    // Add path (line)
    svg
      .append('path')
      .datum(sortedData)
      .attr('fill', 'none')
      .attr('stroke', '#3b82f6')
      .attr('stroke-width', 2.5)
      .attr('d', line)

    // Add filled area under the line
    const area = d3
      .area<iFlightFareTrendData>()
      .x((d: iFlightFareTrendData) => xScale(new Date(d.date)))
      .y0(height)
      .y1((d: iFlightFareTrendData) => yScale(d.price))

    svg
      .append('path')
      .datum(sortedData)
      .attr('fill', '#3b82f6')
      .attr('opacity', 0.1)
      .attr('d', area)

    // Add interactive dots and tooltips
    const dots = svg
      .selectAll('.dot')
      .data(sortedData)
      .enter()
      .append('g')
      .attr('class', 'dot')
      .attr('transform', (d: iFlightFareTrendData) => `translate(${xScale(new Date(d.date))},${yScale(d.price)})`)

    dots
      .append('circle')
      .attr('r', 4)
      .attr('fill', (d: iFlightFareTrendData) => (d.date === selectedDate ? '#ef4444' : '#3b82f6'))
      .attr('opacity', 0.7)
      .style('cursor', 'pointer')
      .on('mouseover', function (event: any, d: iFlightFareTrendData) {
        d3.select(this as any)
          .transition()
          .duration(200)
          .attr('r', 6)
          .attr('opacity', 1)

        // Show tooltip
        svg
          .append('text')
          .attr('class', 'tooltip')
          .attr('x', xScale(new Date(d.date)))
          .attr('y', yScale(d.price) - 15)
          .attr('text-anchor', 'middle')
          .attr('fill', 'currentColor')
          .attr('font-size', '12px')
          .text(`$${d.price.toFixed(2)}`)
      })
      .on('mouseout', function (event: any, d: iFlightFareTrendData) {
        d3.select(this as any)
          .transition()
          .duration(200)
          .attr('r', 4)
          .attr('opacity', 0.7)

        svg.selectAll('.tooltip').remove()
      })
      .on('click', function (event: any, d: iFlightFareTrendData) {
        event.stopPropagation()
        setSelectedDate(d.date)
        onDateSelect?.(d.date)
      })
  }, [data, selectedDate, onDateSelect])

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
        <div className="animate-pulse flex items-center justify-center h-80">
          <p className="text-gray-500 dark:text-gray-400">Loading price trends...</p>
        </div>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
        <p className="text-gray-500 dark:text-gray-400">No price trend data available</p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          Price Trend Analysis
        </h3>
        {selectedDate && (
          <button
            onClick={() => {
              setSelectedDate(null)
              onDateSelect?.(null)
            }}
            className="text-sm px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Clear Selection
          </button>
        )}
      </div>

      <svg ref={svgRef} className="w-full" />

      {selectedDate && (
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900 rounded border border-blue-200 dark:border-blue-700">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            <strong>Selected Date:</strong> {new Date(selectedDate).toLocaleDateString()}
            {selectedDate && (
              <span className="ml-2 text-xs">
                (Click a dot on the chart to change the selection)
              </span>
            )}
          </p>
        </div>
      )}
    </div>
  )
}
