"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CloudRain, Droplets } from "lucide-react"
import type { ForecastData } from "@/lib/weather-api"

interface PrecipitationChartProps {
  data: ForecastData
}

export function PrecipitationChart({ data }: PrecipitationChartProps) {
  // Transform the forecast data for the chart
  const chartData = data.daily.time.map((date, index) => {
    const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short' })
    const precipitation = data.daily.precipitationSum[index]
    
    return {
      date: date,
      day: dayName,
      precipitation: precipitation,
      intensity: precipitation === 0 ? 'none' : precipitation < 2.5 ? 'light' : precipitation < 10 ? 'moderate' : 'heavy'
    }
  })

  // Calculate total precipitation for the period
  const totalPrecipitation = chartData.reduce((sum, day) => sum + day.precipitation, 0)
  const rainyDays = chartData.filter(day => day.precipitation > 0).length

  // Colors for different precipitation intensities
  const getBarColor = (intensity: string, precipitation: number) => {
    if (precipitation === 0) return '#e5e7eb' // gray-200
    switch (intensity) {
      case 'light': return '#60a5fa' // blue-400
      case 'moderate': return '#3b82f6' // blue-500
      case 'heavy': return '#1d4ed8' // blue-700
      default: return '#e5e7eb'
    }
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      const date = new Date(data.date).toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'short', 
        day: 'numeric' 
      })
      
      return (
        <div className="bg-background/95 backdrop-blur-sm border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{date}</p>
          <div className="space-y-1 mt-2">
            <p className="text-sm">
              <span className="text-blue-500">● Precipitation: </span>
              <span className="font-medium">{data.precipitation.toFixed(1)} mm</span>
            </p>
            <p className="text-sm">
              <span className="text-muted-foreground">Intensity: </span>
              <span className="font-medium capitalize">{data.intensity}</span>
            </p>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <Card className="shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-gradient-to-br from-blue-500/10 to-cyan-500/20 rounded-lg">
              <CloudRain className="h-5 w-5 text-blue-500" />
            </div>
            Precipitation Forecast
          </CardTitle>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">7-Day Outlook</p>
            <p className="text-xs text-muted-foreground">
              {rainyDays} rainy day{rainyDays !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] sm:h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="day" 
                axisLine={false}
                tickLine={false}
                className="text-xs"
                tick={{ fontSize: 10 }}
                interval={0}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                className="text-xs"
                tick={{ fontSize: 10 }}
                width={30}
                label={{ value: 'mm', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="precipitation" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={getBarColor(entry.intensity, entry.precipitation)}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Stats and Legend */}
        <div className="mt-4 pt-4 border-t space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Droplets className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Total</span>
              </div>
              <p className="text-2xl font-bold text-blue-500">{totalPrecipitation.toFixed(1)} mm</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <CloudRain className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Rainy Days</span>
              </div>
              <p className="text-2xl font-bold text-blue-500">{rainyDays}</p>
            </div>
          </div>
          
          {/* Intensity Legend */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs">
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="w-3 h-3 bg-gray-200 rounded"></div>
              <span className="hidden sm:inline">No Rain</span>
              <span className="sm:hidden">None</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="w-3 h-3 bg-blue-400 rounded"></div>
              <span className="hidden sm:inline">Light (&lt;2.5mm)</span>
              <span className="sm:hidden">Light</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span className="hidden sm:inline">Moderate (2.5-10mm)</span>
              <span className="sm:hidden">Moderate</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="w-3 h-3 bg-blue-700 rounded"></div>
              <span className="hidden sm:inline">Heavy (&gt;10mm)</span>
              <span className="sm:hidden">Heavy</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}