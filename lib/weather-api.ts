export interface WeatherData {
  current: {
    temperature: number
    humidity: number
    windSpeed: number
    windDirection: number
    weatherCode: number
    isDay: boolean
    pressure: number
    visibility: number
    uvIndex: number
    cloudCover: number
    dewPoint: number
    feelsLike: number
  }
  location: {
    name: string
    latitude: number
    longitude: number
    timezone: string
  }
}

export interface ForecastData {
  daily: {
    time: string[]
    temperatureMax: number[]
    temperatureMin: number[]
    weatherCode: number[]
    precipitationSum: number[]
    windSpeedMax: number[]
  }
}

export interface LocationResult {
  id: number
  name: string
  latitude: number
  longitude: number
  country: string
  admin1?: string
}

// Weather code to description mapping
export const weatherCodeMap: Record<number, { description: string; icon: string }> = {
  0: { description: "Clear sky", icon: "☀️" },
  1: { description: "Mainly clear", icon: "🌤️" },
  2: { description: "Partly cloudy", icon: "⛅" },
  3: { description: "Overcast", icon: "☁️" },
  45: { description: "Fog", icon: "🌫️" },
  48: { description: "Depositing rime fog", icon: "🌫️" },
  51: { description: "Light drizzle", icon: "🌦️" },
  53: { description: "Moderate drizzle", icon: "🌦️" },
  55: { description: "Dense drizzle", icon: "🌧️" },
  61: { description: "Slight rain", icon: "🌧️" },
  63: { description: "Moderate rain", icon: "🌧️" },
  65: { description: "Heavy rain", icon: "⛈️" },
  71: { description: "Slight snow", icon: "🌨️" },
  73: { description: "Moderate snow", icon: "❄️" },
  75: { description: "Heavy snow", icon: "❄️" },
  95: { description: "Thunderstorm", icon: "⛈️" },
  96: { description: "Thunderstorm with hail", icon: "⛈️" },
  99: { description: "Thunderstorm with heavy hail", icon: "⛈️" },
}

// Reverse geocoding to get location name from coordinates
export async function reverseGeocode(latitude: number, longitude: number): Promise<string> {
  try {
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?latitude=${latitude}&longitude=${longitude}&count=1&language=en&format=json`,
    )

    if (!response.ok) {
      return "Unknown Location"
    }

    const data = await response.json()
    
    if (data.results && data.results.length > 0) {
      const result = data.results[0]
      return `${result.name}${result.admin1 ? `, ${result.admin1}` : ""}, ${result.country}`
    }
    
    return "Unknown Location"
  } catch (error) {
    console.error("Reverse geocoding failed:", error)
    return "Unknown Location"
  }
}

export async function getCurrentWeather(latitude: number, longitude: number): Promise<WeatherData> {
  const [weatherResponse, locationName] = await Promise.all([
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m,weather_code,is_day,surface_pressure,visibility,uv_index,cloud_cover,dew_point_2m,apparent_temperature&timezone=auto`,
    ),
    reverseGeocode(latitude, longitude)
  ])

  if (!weatherResponse.ok) {
    throw new Error("Failed to fetch weather data")
  }

  const data = await weatherResponse.json()

  return {
    current: {
      temperature: Math.round(data.current.temperature_2m),
      humidity: data.current.relative_humidity_2m,
      windSpeed: Math.round(data.current.wind_speed_10m),
      windDirection: data.current.wind_direction_10m,
      weatherCode: data.current.weather_code,
      isDay: data.current.is_day === 1,
      pressure: Math.round(data.current.surface_pressure),
      visibility: Math.round(data.current.visibility / 1000), // Convert to km
      uvIndex: Math.round(data.current.uv_index * 10) / 10, // Round to 1 decimal
      cloudCover: data.current.cloud_cover,
      dewPoint: Math.round(data.current.dew_point_2m),
      feelsLike: Math.round(data.current.apparent_temperature),
    },
    location: {
      name: locationName,
      latitude: data.latitude,
      longitude: data.longitude,
      timezone: data.timezone,
    },
  }
}

export async function getWeatherForecast(latitude: number, longitude: number): Promise<ForecastData> {
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_sum,wind_speed_10m_max&timezone=auto`,
  )

  if (!response.ok) {
    throw new Error("Failed to fetch forecast data")
  }

  const data = await response.json()

  return {
    daily: {
      time: data.daily.time,
      temperatureMax: data.daily.temperature_2m_max.map((temp: number) => Math.round(temp)),
      temperatureMin: data.daily.temperature_2m_min.map((temp: number) => Math.round(temp)),
      weatherCode: data.daily.weather_code,
      precipitationSum: data.daily.precipitation_sum,
      windSpeedMax: data.daily.wind_speed_10m_max.map((speed: number) => Math.round(speed)),
    },
  }
}

export async function searchLocations(query: string): Promise<LocationResult[]> {
  if (query.length < 2) return []

  const response = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=10&language=en&format=json`,
  )

  if (!response.ok) {
    throw new Error("Failed to search locations")
  }

  const data = await response.json()

  return (
    data.results?.map((result: any) => ({
      id: result.id,
      name: result.name,
      latitude: result.latitude,
      longitude: result.longitude,
      country: result.country,
      admin1: result.admin1,
    })) || []
  )
}

export function getWeatherDescription(weatherCode: number): { description: string; icon: string } {
  return weatherCodeMap[weatherCode] || { description: "Unknown", icon: "❓" }
}

// Get user's current location
export function getCurrentLocation(): Promise<{ latitude: number; longitude: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser"))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
      },
      (error) => {
        reject(new Error(`Geolocation error: ${error.message}`))
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      },
    )
  })
}
