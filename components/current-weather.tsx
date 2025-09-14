"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, MapPin, Wind, Droplets, Eye, Gauge, Sun, Moon, CloudRain } from "lucide-react"
import { getWeatherDescription } from "@/lib/weather-api"
import type { WeatherData } from "@/lib/weather-api"

interface CurrentWeatherProps {
  data: WeatherData
  onRefresh: () => void
  isRefreshing?: boolean
}

export function CurrentWeather({ data, onRefresh, isRefreshing = false }: CurrentWeatherProps) {
  const weather = getWeatherDescription(data.current.weatherCode)
  const windDirectionDegrees = data.current.windDirection

  // Convert wind direction to compass direction
  const getWindDirection = (degrees: number) => {
    const directions = [
      "N",
      "NNE",
      "NE",
      "ENE",
      "E",
      "ESE",
      "SE",
      "SSE",
      "S",
      "SSW",
      "SW",
      "WSW",
      "W",
      "WNW",
      "NW",
      "NNW",
    ]
    return directions[Math.round(degrees / 22.5) % 16]
  }

  const getWindIntensity = (speed: number) => {
    if (speed < 10) return { level: "Light", color: "text-green-500" }
    if (speed < 25) return { level: "Moderate", color: "text-yellow-500" }
    if (speed < 40) return { level: "Strong", color: "text-orange-500" }
    return { level: "Very Strong", color: "text-red-500" }
  }

  const windIntensity = getWindIntensity(data.current.windSpeed)

  return (
    <div className="space-y-6">
      <Card className="relative overflow-hidden border-0 shadow-2xl dark:shadow-primary/5">
        <div className="absolute inset-0 weather-gradient-light dark:weather-gradient-dark" />
        <div className="absolute inset-0 glass-effect" />
        <CardContent className="relative p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 dark:bg-primary/30 rounded-xl backdrop-blur-sm">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold text-lg">{data.location.name}</h2>
                <p className="text-sm text-muted-foreground">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="backdrop-blur-sm">
                {data.current.isDay ? "Day" : "Night"}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={onRefresh}
                disabled={isRefreshing}
                className="backdrop-blur-sm hover:bg-primary/10"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="text-7xl font-bold bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent">
                {data.current.temperature}°
              </div>
              <div className="text-xl font-medium text-foreground/80">{weather.description}</div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {data.current.isDay ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                <span>Feels like {data.current.feelsLike}°</span>
              </div>
            </div>
            <div className="text-8xl opacity-90 filter drop-shadow-lg">{weather.icon}</div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-500/10 to-blue-600/20 rounded-xl group-hover:scale-110 transition-transform">
                <Wind className="h-6 w-6 text-blue-500" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-muted-foreground">Wind Speed</div>
                <div className="text-2xl font-bold">{data.current.windSpeed}</div>
                <div className="text-xs text-muted-foreground">
                  km/h {getWindDirection(windDirectionDegrees)} •{" "}
                  <span className={windIntensity.color}>{windIntensity.level}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-cyan-500/10 to-cyan-600/20 rounded-xl group-hover:scale-110 transition-transform">
                <Droplets className="h-6 w-6 text-cyan-500" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-muted-foreground">Humidity</div>
                <div className="text-2xl font-bold">{data.current.humidity}%</div>
                <div className="text-xs text-muted-foreground">
                  {data.current.humidity > 70 ? "High" : data.current.humidity > 40 ? "Moderate" : "Low"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-purple-500/10 to-purple-600/20 rounded-xl group-hover:scale-110 transition-transform">
                <Eye className="h-6 w-6 text-purple-500" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-muted-foreground">Visibility</div>
                <div className="text-2xl font-bold">{data.current.visibility} km</div>
                <div className="text-xs text-muted-foreground">
                  {data.current.visibility > 10 ? "Excellent" : data.current.visibility > 5 ? "Good" : data.current.visibility > 2 ? "Moderate" : "Poor"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-orange-500/10 to-orange-600/20 rounded-xl group-hover:scale-110 transition-transform">
                <Gauge className="h-6 w-6 text-orange-500" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-muted-foreground">Pressure</div>
                <div className="text-2xl font-bold">{data.current.pressure}</div>
                <div className="text-xs text-muted-foreground">
                  hPa • {data.current.pressure > 1020 ? "High" : data.current.pressure > 1000 ? "Normal" : "Low"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional weather metrics grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-yellow-500/10 to-yellow-600/20 rounded-xl group-hover:scale-110 transition-transform">
                <Sun className="h-6 w-6 text-yellow-500" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-muted-foreground">UV Index</div>
                <div className="text-2xl font-bold">{data.current.uvIndex}</div>
                <div className="text-xs text-muted-foreground">
                  {data.current.uvIndex < 3 ? "Low" : data.current.uvIndex < 6 ? "Moderate" : data.current.uvIndex < 8 ? "High" : data.current.uvIndex < 11 ? "Very High" : "Extreme"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-gray-500/10 to-gray-600/20 rounded-xl group-hover:scale-110 transition-transform">
                <CloudRain className="h-6 w-6 text-gray-500" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-muted-foreground">Cloud Cover</div>
                <div className="text-2xl font-bold">{data.current.cloudCover}%</div>
                <div className="text-xs text-muted-foreground">
                  {data.current.cloudCover < 25 ? "Clear" : data.current.cloudCover < 50 ? "Partly Cloudy" : data.current.cloudCover < 75 ? "Mostly Cloudy" : "Overcast"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-cyan-500/10 to-cyan-600/20 rounded-xl group-hover:scale-110 transition-transform">
                <Droplets className="h-6 w-6 text-cyan-500" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-muted-foreground">Dew Point</div>
                <div className="text-2xl font-bold">{data.current.dewPoint}°</div>
                <div className="text-xs text-muted-foreground">
                  {data.current.dewPoint < 10 ? "Dry" : data.current.dewPoint < 16 ? "Comfortable" : data.current.dewPoint < 21 ? "Humid" : "Very Humid"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
