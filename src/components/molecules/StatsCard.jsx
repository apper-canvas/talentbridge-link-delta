import React from "react"
import { cn } from "@/utils/cn"
import Card from "@/components/atoms/Card"
import ApperIcon from "@/components/ApperIcon"

const StatsCard = ({ 
  title, 
  value, 
  icon, 
  trend,
  trendValue,
  className,
  ...props 
}) => {
  return (
    <Card className={cn("relative overflow-hidden", className)} {...props}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
            {value}
          </p>
          {trend && (
            <div className={cn(
              "flex items-center gap-1 text-sm font-medium",
              trend === "up" ? "text-success" : "text-error"
            )}>
              <ApperIcon 
                name={trend === "up" ? "TrendingUp" : "TrendingDown"} 
                size={16} 
              />
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        {icon && (
          <div className="p-3 bg-gradient-to-br from-primary/10 to-primary/20 rounded-lg">
            <ApperIcon name={icon} size={24} className="text-primary" />
          </div>
        )}
      </div>
    </Card>
  )
}

export default StatsCard