"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CurrentWeather } from "@/components/current-weather"
import { WeatherForecast } from "@/components/weather-forecast"
import { LocationSearch } from "@/components/location-search"
import { WeatherSkeleton } from "@/components/weather-skeleton"
import { ForecastSkeleton } from "@/components/forecast-skeleton"
import { TemperatureChart } from "@/components/temperature-chart"
import { PrecipitationChart } from "@/components/precipitation-chart"
import { WindCompass } from "@/components/wind-compass"
import { useWeather } from "@/hooks/use-weather"
import { Sun, Search, Home, Calendar, Moon, CloudRain, Droplets, Wind, BarChart3 } from "lucide-react"

export default function WeatherApp() {
  const { weatherData, forecastData, loading, error, refreshWeather, loadWeatherForLocation } = useWeather()
  const [activeTab, setActiveTab] = useState("current")
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme")
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

    if (savedTheme === "dark" || (!savedTheme && systemPrefersDark)) {
      setIsDarkMode(true)
      document.documentElement.classList.add("dark")
    }
  }, [])

  const handleLocationSelect = async (latitude: number, longitude: number, name: string) => {
    await loadWeatherForLocation(latitude, longitude)
    setActiveTab("current")
  }

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode
    setIsDarkMode(newDarkMode)
    document.documentElement.classList.toggle("dark")
    localStorage.setItem("theme", newDarkMode ? "dark" : "light")
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl">
          <CardContent className="p-8 text-center">
            <div className="p-4 bg-destructive/10 rounded-full w-fit mx-auto mb-6">
              <CloudRain className="h-12 w-12 text-destructive" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Weather Unavailable</h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">{error}</p>
            <Button onClick={refreshWeather} size="lg" className="w-full">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/80 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl backdrop-blur-sm">
                <Sun className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-primary">WeatherApp</h1>
                <p className="text-sm text-muted-foreground font-medium">Your complete weather companion</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="hidden sm:inline-flex backdrop-blur-sm">
                Free API
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleDarkMode}
                className="backdrop-blur-sm hover:bg-primary/10 transition-all duration-300"
              >
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4 h-12 p-1 bg-muted/50 backdrop-blur-sm">
            <TabsTrigger
              value="current"
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300"
            >
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline font-medium">Current</span>
            </TabsTrigger>
            <TabsTrigger
              value="forecast"
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300"
            >
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline font-medium">Forecast</span>
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300"
            >
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline font-medium">Analytics</span>
            </TabsTrigger>
            <TabsTrigger
              value="search"
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300"
            >
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline font-medium">Search</span>
            </TabsTrigger>
          </TabsList>

          {/* Current Weather Tab */}
          <TabsContent value="current" className="space-y-6">
            {loading ? (
              <WeatherSkeleton />
            ) : weatherData ? (
              <CurrentWeather data={weatherData} onRefresh={refreshWeather} isRefreshing={loading} />
            ) : null}
          </TabsContent>

          {/* Forecast Tab */}
          <TabsContent value="forecast" className="space-y-6">
            {loading ? <ForecastSkeleton /> : forecastData ? <WeatherForecast data={forecastData} /> : null}
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            {loading ? (
              <div className="space-y-6">
                <ForecastSkeleton />
                <ForecastSkeleton />
              </div>
            ) : (forecastData && weatherData) ? (
              <div className="space-y-6">
                {/* Charts Grid */}
                <div className="space-y-6">
                  <TemperatureChart data={forecastData} />
                  <PrecipitationChart data={forecastData} />
                </div>
                
                {/* Wind and Additional Metrics */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  <WindCompass 
                    windDirection={weatherData.current.windDirection} 
                    windSpeed={weatherData.current.windSpeed} 
                  />
                  
                  {/* Air Quality Card */}
                  <Card className="shadow-lg">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
                        <div className="p-2 bg-gradient-to-br from-green-500/10 to-emerald-500/20 rounded-lg">
                          <Wind className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                        </div>
                        <span className="hidden sm:inline">Air Quality & Comfort</span>
                        <span className="sm:hidden">Air Quality</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-3 sm:gap-4">
                        <div className="text-center p-3 sm:p-4 rounded-lg bg-gradient-to-br from-blue-500/5 to-blue-500/10">
                          <div className="text-xl sm:text-2xl font-bold text-blue-500">{weatherData.current.humidity}%</div>
                          <div className="text-xs sm:text-sm text-muted-foreground">Humidity</div>
                        </div>
                        <div className="text-center p-3 sm:p-4 rounded-lg bg-gradient-to-br from-orange-500/5 to-orange-500/10">
                          <div className="text-xl sm:text-2xl font-bold text-orange-500">{weatherData.current.uvIndex}</div>
                          <div className="text-xs sm:text-sm text-muted-foreground">UV Index</div>
                        </div>
                        <div className="text-center p-3 sm:p-4 rounded-lg bg-gradient-to-br from-purple-500/5 to-purple-500/10">
                          <div className="text-xl sm:text-2xl font-bold text-purple-500">{weatherData.current.visibility} km</div>
                          <div className="text-xs sm:text-sm text-muted-foreground">Visibility</div>
                        </div>
                        <div className="text-center p-3 sm:p-4 rounded-lg bg-gradient-to-br from-gray-500/5 to-gray-500/10">
                          <div className="text-xl sm:text-2xl font-bold text-gray-500">{weatherData.current.cloudCover}%</div>
                          <div className="text-xs sm:text-sm text-muted-foreground">Clouds</div>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs sm:text-sm font-medium text-muted-foreground">Feels like</span>
                          <span className="text-base sm:text-lg font-bold">{weatherData.current.feelsLike}°</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs sm:text-sm font-medium text-muted-foreground">Dew point</span>
                          <span className="text-base sm:text-lg font-bold">{weatherData.current.dewPoint}°</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs sm:text-sm font-medium text-muted-foreground">Pressure</span>
                          <span className="text-base sm:text-lg font-bold">{weatherData.current.pressure} hPa</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              <Card className="shadow-lg">
                <CardContent className="p-8 text-center">
                  <div className="p-4 bg-muted/10 rounded-full w-fit mx-auto mb-4">
                    <BarChart3 className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No Data Available</h3>
                  <p className="text-muted-foreground">Please wait for weather data to load or search for a location.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Search Tab */}
          <TabsContent value="search" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Search className="h-5 w-5 text-primary" />
                  </div>
                  Find Weather
                </CardTitle>
              </CardHeader>
              <CardContent>
                <LocationSearch onLocationSelect={handleLocationSelect} currentLocation={weatherData?.location.name} />
              </CardContent>
            </Card>

            {/* Enhanced Quick Stats */}
            {weatherData && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <CardContent className="p-6 text-center">
                    <div className="p-3 bg-gradient-to-br from-primary/10 to-primary/20 rounded-full w-fit mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <Sun className="h-8 w-8 text-primary" />
                    </div>
                    <div className="text-3xl font-bold text-primary mb-1">{weatherData.current.temperature}°</div>
                    <div className="text-sm font-medium text-muted-foreground">Current Temperature</div>
                  </CardContent>
                </Card>
                <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <CardContent className="p-6 text-center">
                    <div className="p-3 bg-gradient-to-br from-cyan-500/10 to-cyan-500/20 rounded-full w-fit mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <Droplets className="h-8 w-8 text-cyan-500" />
                    </div>
                    <div className="text-3xl font-bold text-cyan-500 mb-1">{weatherData.current.humidity}%</div>
                    <div className="text-sm font-medium text-muted-foreground">Humidity</div>
                  </CardContent>
                </Card>
                <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <CardContent className="p-6 text-center">
                    <div className="p-3 bg-gradient-to-br from-blue-500/10 to-blue-500/20 rounded-full w-fit mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <Wind className="h-8 w-8 text-blue-500" />
                    </div>
                    <div className="text-3xl font-bold text-blue-500 mb-1">{weatherData.current.windSpeed}</div>
                    <div className="text-sm font-medium text-muted-foreground">Wind Speed (km/h)</div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <footer className="border-t bg-card/50 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-sm text-muted-foreground">
              Weather data provided by{" "}
              <a
                href="https://open-meteo.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium transition-colors"
              >
                Open-Meteo
              </a>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span className="font-medium">Built with Next.js</span>
              <Badge variant="outline" className="backdrop-blur-sm">
                Free & Open Source
              </Badge>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
