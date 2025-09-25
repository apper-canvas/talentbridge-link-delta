import React from "react"
import { cn } from "@/utils/cn"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"

const Empty = ({ 
  className, 
  message = "No data available", 
  description,
  actionLabel,
  onAction,
  icon = "Inbox",
  ...props 
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 text-center", className)} {...props}>
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <ApperIcon name={icon} size={32} className="text-gray-400" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{message}</h3>
      {description && (
        <p className="text-gray-600 mb-6 max-w-md">{description}</p>
      )}
      {actionLabel && onAction && (
        <Button onClick={onAction} className="flex items-center gap-2">
          <ApperIcon name="Plus" size={16} />
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

export default Empty