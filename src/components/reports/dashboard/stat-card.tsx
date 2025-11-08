import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  trend?: string
  trendUp?: boolean
  isLoading?: boolean
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, trendUp, isLoading }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-2">{isLoading ? "..." : value}</p>
            {trend && (
              <p className={`text-xs mt-1 flex items-center gap-1 ${trendUp ? "text-green-600" : "text-red-600"}`}>
                <TrendingUp className={`h-3 w-3 ${!trendUp && "rotate-180"}`} />
                {trend}
              </p>
            )}
          </div>
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">{icon}</div>
        </div>
      </CardContent>
    </Card>
  )
}
