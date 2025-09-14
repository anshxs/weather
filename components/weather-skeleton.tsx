import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function WeatherSkeleton() {
  return (
    <div className="space-y-6">
      {/* Main Weather Card Skeleton */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-8 w-8" />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-16 w-24" />
              <Skeleton className="h-6 w-40" />
            </div>
            <Skeleton className="h-16 w-16" />
          </div>
        </CardContent>
      </Card>

      {/* Weather Details Grid Skeleton */}
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-9 w-9 rounded-lg" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-5 w-20" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
