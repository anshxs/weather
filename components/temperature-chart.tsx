"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"
import type { ForecastData } from "@/lib/weather-api"

interface TemperatureChartProps {
  data: ForecastData
}

export function TemperatureChart({ data }: TemperatureChartProps) {
  // Transform the forecast data for the chart
  const chartData = data.daily.time.map((date, index) => {
    const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short' })
    const monthDay = new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    
    return {
      date: date,
      day: dayName,
      shortDate: monthDay,
      maxTemp: data.daily.temperatureMax[index],
      minTemp: data.daily.temperatureMin[index],
      avgTemp: Math.round((data.daily.temperatureMax[index] + data.daily.temperatureMin[index]) / 2),
    }
  })

  // Calculate temperature trend
  const avgTempChange = chartData.length > 1 
    ? chartData[chartData.length - 1].avgTemp - chartData[0].avgTemp 
    : 0

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-background/95 backdrop-blur-sm border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{`${data.day}, ${data.shortDate}`}</p>
          <div className="space-y-1 mt-2">
            <p className="text-sm">
              <span className="text-red-500">● High: </span>
              <span className="font-medium">{data.maxTemp}°</span>
            </p>
            <p className="text-sm">
              <span className="text-blue-500">● Low: </span>
              <span className="font-medium">{data.minTemp}°</span>
            </p>
            <p className="text-sm">
              <span className="text-muted-foreground">Average: </span>
              <span className="font-medium">{data.avgTemp}°</span>
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
            <div className="p-2 bg-gradient-to-br from-orange-500/10 to-red-500/20 rounded-lg">
              {avgTempChange >= 0 ? (
                <TrendingUp className="h-5 w-5 text-orange-500" />
              ) : (
                <TrendingDown className="h-5 w-5 text-blue-500" />
              )}
            </div>
            Temperature Trends
          </CardTitle>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">7-Day Outlook</p>
            <p className="text-xs text-muted-foreground">
              {avgTempChange >= 0 ? "Getting warmer" : "Getting cooler"} 
              {avgTempChange !== 0 && ` (${avgTempChange > 0 ? '+' : ''}${avgTempChange}°)`}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] sm:h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="maxTempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="minTempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
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
                label={{ value: '°C', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={<CustomTooltip />} />
              
              <Area
                type="monotone"
                dataKey="maxTemp"
                stroke="#f97316"
                strokeWidth={2}
                fill="url(#maxTempGradient)"
                dot={{ fill: '#f97316', strokeWidth: 2, r: 3 }}
                activeDot={{ r: 5, fill: '#f97316' }}
              />
              <Area
                type="monotone"
                dataKey="minTemp"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#minTempGradient)"
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3 }}
                activeDot={{ r: 5, fill: '#3b82f6' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span className="text-sm font-medium">High Temperature</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm font-medium">Low Temperature</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}