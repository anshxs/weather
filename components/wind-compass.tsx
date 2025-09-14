"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Wind, Navigation } from "lucide-react"

interface WindCompassProps {
  windDirection: number
  windSpeed: number
}

export function WindCompass({ windDirection, windSpeed }: WindCompassProps) {
  // Convert wind direction to compass direction
  const getWindDirection = (degrees: number) => {
    const directions = [
      "N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
      "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"
    ]
    return directions[Math.round(degrees / 22.5) % 16]
  }

  const getWindIntensity = (speed: number) => {
    if (speed < 10) return { level: "Light", color: "text-green-500", bgColor: "from-green-500/10 to-green-600/20" }
    if (speed < 25) return { level: "Moderate", color: "text-yellow-500", bgColor: "from-yellow-500/10 to-yellow-600/20" }
    if (speed < 40) return { level: "Strong", color: "text-orange-500", bgColor: "from-orange-500/10 to-orange-600/20" }
    return { level: "Very Strong", color: "text-red-500", bgColor: "from-red-500/10 to-red-600/20" }
  }

  const windIntensity = getWindIntensity(windSpeed)
  const compassDirection = getWindDirection(windDirection)

  // Calculate the rotation for the arrow (pointing in wind direction)
  const arrowRotation = windDirection

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-105">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-lg">
          <div className={`p-2 bg-gradient-to-br ${windIntensity.bgColor} rounded-lg group-hover:scale-110 transition-transform`}>
            <Wind className={`h-5 w-5 ${windIntensity.color}`} />
          </div>
          Wind Direction
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Compass Circle */}
        <div className="relative flex items-center justify-center">
          <div className="relative w-24 h-24 sm:w-32 sm:h-32">
            {/* Compass Background */}
            <div className="w-full h-full rounded-full border-2 border-muted bg-gradient-to-br from-background to-muted/20 shadow-inner">
              {/* Cardinal Directions */}
              <div className="absolute inset-0 rounded-full">
                {/* North */}
                <div className="absolute top-0.5 sm:top-1 left-1/2 transform -translate-x-1/2">
                  <span className="text-xs font-bold text-red-500">N</span>
                </div>
                {/* South */}
                <div className="absolute bottom-0.5 sm:bottom-1 left-1/2 transform -translate-x-1/2">
                  <span className="text-xs font-bold text-muted-foreground">S</span>
                </div>
                {/* East */}
                <div className="absolute right-0.5 sm:right-1 top-1/2 transform -translate-y-1/2">
                  <span className="text-xs font-bold text-muted-foreground">E</span>
                </div>
                {/* West */}
                <div className="absolute left-0.5 sm:left-1 top-1/2 transform -translate-y-1/2">
                  <span className="text-xs font-bold text-muted-foreground">W</span>
                </div>
              </div>
              
              {/* Wind Direction Arrow */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div 
                  className="transform transition-transform duration-500 ease-out"
                  style={{ transform: `rotate(${arrowRotation}deg)` }}
                >
                  <Navigation className={`h-6 w-6 sm:h-8 sm:w-8 ${windIntensity.color} drop-shadow-lg`} />
                </div>
              </div>
              
              {/* Center Dot */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-2 h-2 bg-foreground rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Wind Information */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Direction</span>
            <span className="font-bold">{compassDirection}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Degrees</span>
            <span className="font-bold">{windDirection}°</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Speed</span>
            <span className="font-bold">{windSpeed} km/h</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Intensity</span>
            <span className={`font-bold ${windIntensity.color}`}>{windIntensity.level}</span>
          </div>
        </div>

        {/* Speed Indicator Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0</span>
            <span>50+ km/h</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div 
              className={`h-full bg-gradient-to-r ${windIntensity.bgColor.replace('/10', '/50').replace('/20', '/60')} transition-all duration-500`}
              style={{ width: `${Math.min((windSpeed / 50) * 100, 100)}%` }}
            ></div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}