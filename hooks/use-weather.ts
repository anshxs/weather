"use client"

import { useState, useEffect } from "react"
import {
  getCurrentWeather,
  getWeatherForecast,
  getCurrentLocation,
  type WeatherData,
  type ForecastData,
} from "@/lib/weather-api"

export function useWeather() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [forecastData, setForecastData] = useState<ForecastData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchWeatherData = async (latitude: number, longitude: number) => {
    try {
      setLoading(true)
      setError(null)

      const [weather, forecast] = await Promise.all([
        getCurrentWeather(latitude, longitude),
        getWeatherForecast(latitude, longitude),
      ])

      setWeatherData(weather)
      setForecastData(forecast)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch weather data")
    } finally {
      setLoading(false)
    }
  }

  const refreshWeather = async () => {
    if (weatherData) {
      await fetchWeatherData(weatherData.location.latitude, weatherData.location.longitude)
    }
  }

  const loadWeatherForLocation = async (latitude: number, longitude: number) => {
    await fetchWeatherData(latitude, longitude)
  }

  useEffect(() => {
    const loadCurrentLocationWeather = async () => {
      try {
        const location = await getCurrentLocation()
        await fetchWeatherData(location.latitude, location.longitude)
      } catch (err) {
        // Fallback to a default location (New York) if geolocation fails
        await fetchWeatherData(40.7128, -74.006)
      }
    }

    loadCurrentLocationWeather()
  }, [])

  return {
    weatherData,
    forecastData,
    loading,
    error,
    refreshWeather,
    loadWeatherForLocation,
  }
}
