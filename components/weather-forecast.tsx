"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { getWeatherDescription } from "@/lib/weather-api"
import type { ForecastData } from "@/lib/weather-api"
import { CalendarDays, Droplets, Wind } from "lucide-react"

interface WeatherForecastProps {
  data: ForecastData
}

export function WeatherForecast({ data }: WeatherForecastProps) {
  const formatDate = (dateString: string, index: number) => {
    const date = new Date(dateString)
    if (index === 0) return "Today"
    if (index === 1) return "Tomorrow"
    return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
  }

  const getDayName = (dateString: string, index: number) => {
    if (index === 0) return "Today"
    if (index === 1) return "Tomorrow"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { weekday: "long" })
  }

  return (
    <div className="space-y-6">
      {/* 7-Day Forecast Horizontal Scroll */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            7-Day Forecast
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex gap-4 pb-4">
              {data.daily.time.map((date, index) => {
                const weather = getWeatherDescription(data.daily.weatherCode[index])
                return (
                  <div key={date} className="flex-none w-32 p-4 bg-muted/50 rounded-lg text-center space-y-2">
                    <div className="text-sm font-medium text-muted-foreground">{formatDate(date, index)}</div>
                    <div className="text-3xl">{weather.icon}</div>
                    <div className="text-xs text-muted-foreground truncate">{weather.description}</div>
                    <div className="space-y-1">
                      <div className="font-semibold">{data.daily.temperatureMax[index]}°</div>
                      <div className="text-sm text-muted-foreground">{data.daily.temperatureMin[index]}°</div>
                    </div>
                    <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                      <Droplets className="h-3 w-3" />
                      {data.daily.precipitationSum[index]}mm
                    </div>
                  </div>
                )
              })}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Detailed Daily Forecast */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.daily.time.slice(0, 5).map((date, index) => {
              const weather = getWeatherDescription(data.daily.weatherCode[index])
              return (
                <div key={date} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="text-2xl">{weather.icon}</div>
                    <div>
                      <div className="font-medium">{getDayName(date, index)}</div>
                      <div className="text-sm text-muted-foreground">{weather.description}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <Droplets className="h-4 w-4 text-primary" />
                      <span>{data.daily.precipitationSum[index]}mm</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Wind className="h-4 w-4 text-primary" />
                      <span>{data.daily.windSpeedMax[index]} km/h</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{data.daily.temperatureMax[index]}°</div>
                      <div className="text-muted-foreground">{data.daily.temperatureMin[index]}°</div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
