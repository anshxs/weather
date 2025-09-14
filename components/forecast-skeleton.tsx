import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function ForecastSkeleton() {
  return (
    <div className="space-y-6">
      {/* 7-Day Forecast Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 pb-4">
            {Array.from({ length: 7 }).map((_, index) => (
              <div key={index} className="flex-none w-32 p-4 bg-muted/50 rounded-lg space-y-2">
                <Skeleton className="h-4 w-16 mx-auto" />
                <Skeleton className="h-12 w-12 mx-auto" />
                <Skeleton className="h-3 w-20 mx-auto" />
                <div className="space-y-1">
                  <Skeleton className="h-5 w-8 mx-auto" />
                  <Skeleton className="h-4 w-6 mx-auto" />
                </div>
                <Skeleton className="h-3 w-12 mx-auto" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Forecast Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-8 w-8" />
                  <div className="space-y-1">
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 w-16" />
                  <div className="space-y-1">
                    <Skeleton className="h-5 w-8" />
                    <Skeleton className="h-4 w-6" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
