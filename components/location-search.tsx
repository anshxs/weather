"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, Loader2, Navigation, X } from "lucide-react"
import { searchLocations, getCurrentLocation, type LocationResult } from "@/lib/weather-api"
import { useDebounce } from "@/hooks/use-debounce"

interface LocationSearchProps {
  onLocationSelect: (latitude: number, longitude: number, name: string) => void
  currentLocation?: string
}

export function LocationSearch({ onLocationSelect, currentLocation }: LocationSearchProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<LocationResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [savedLocations, setSavedLocations] = useState<LocationResult[]>([])

  const debouncedQuery = useDebounce(query, 300)
  const searchRef = useRef<HTMLDivElement>(null)

  // Load saved locations from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("weather-saved-locations")
    if (saved) {
      try {
        setSavedLocations(JSON.parse(saved))
      } catch (error) {
        console.error("Failed to parse saved locations:", error)
      }
    }
  }, [])

  // Search for locations when query changes
  useEffect(() => {
    const performSearch = async () => {
      if (debouncedQuery.length < 2) {
        setResults([])
        setShowResults(false)
        return
      }

      setIsSearching(true)
      try {
        const searchResults = await searchLocations(debouncedQuery)
        setResults(searchResults)
        setShowResults(true)
      } catch (error) {
        console.error("Search failed:", error)
        setResults([])
      } finally {
        setIsSearching(false)
      }
    }

    performSearch()
  }, [debouncedQuery])

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLocationSelect = (location: LocationResult) => {
    onLocationSelect(location.latitude, location.longitude, location.name)
    setQuery("")
    setShowResults(false)

    // Save to recent locations
    const newSavedLocations = [location, ...savedLocations.filter((saved) => saved.id !== location.id)].slice(0, 5) // Keep only 5 recent locations

    setSavedLocations(newSavedLocations)
    localStorage.setItem("weather-saved-locations", JSON.stringify(newSavedLocations))
  }

  const handleCurrentLocation = async () => {
    setIsGettingLocation(true)
    try {
      const location = await getCurrentLocation()
      onLocationSelect(location.latitude, location.longitude, "Current Location")
    } catch (error) {
      console.error("Failed to get current location:", error)
    } finally {
      setIsGettingLocation(false)
    }
  }

  const removeSavedLocation = (locationId: number) => {
    const newSavedLocations = savedLocations.filter((location) => location.id !== locationId)
    setSavedLocations(newSavedLocations)
    localStorage.setItem("weather-saved-locations", JSON.stringify(newSavedLocations))
  }

  const formatLocationName = (location: LocationResult) => {
    return `${location.name}${location.admin1 ? `, ${location.admin1}` : ""}, ${location.country}`
  }

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative" ref={searchRef}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search for a city..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowResults(results.length > 0)}
            className="pl-10 pr-4"
          />
          {isSearching && (
            <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
          )}
        </div>

        {/* Search Results */}
        {showResults && results.length > 0 && (
          <Card className="absolute top-full left-0 right-0 z-50 mt-1 max-h-64 overflow-y-auto">
            <CardContent className="p-0">
              {results.map((location) => (
                <button
                  key={location.id}
                  onClick={() => handleLocationSelect(location)}
                  className="w-full text-left p-3 hover:bg-muted/50 transition-colors border-b border-border last:border-b-0 flex items-center gap-3"
                >
                  <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <div>
                    <div className="font-medium">{location.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {location.admin1 && `${location.admin1}, `}
                      {location.country}
                    </div>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Current Location Button */}
      <Button
        variant="outline"
        onClick={handleCurrentLocation}
        disabled={isGettingLocation}
        className="w-full bg-transparent"
      >
        {isGettingLocation ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : (
          <Navigation className="h-4 w-4 mr-2" />
        )}
        Use Current Location
      </Button>

      {/* Saved Locations */}
      {savedLocations.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">Recent Locations</h3>
          <div className="flex flex-wrap gap-2">
            {savedLocations.map((location) => (
              <Badge
                key={location.id}
                variant="secondary"
                className="cursor-pointer hover:bg-secondary/80 transition-colors group pr-1"
              >
                <span onClick={() => handleLocationSelect(location)} className="pr-2">
                  {formatLocationName(location)}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    removeSavedLocation(location.id)
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/20 rounded-sm p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Current Location Display */}
      {currentLocation && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>Currently showing: {currentLocation}</span>
        </div>
      )}
    </div>
  )
}
