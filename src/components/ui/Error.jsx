import React from "react"
import { cn } from "@/utils/cn"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"

const Error = ({ 
  className, 
  message = "Something went wrong", 
  onRetry,
  ...props 
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 text-center", className)} {...props}>
      <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mb-4">
        <ApperIcon name="AlertTriangle" size={32} className="text-error" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h3>
      <p className="text-gray-600 mb-6 max-w-md">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} className="flex items-center gap-2">
          <ApperIcon name="RefreshCw" size={16} />
          Try Again
        </Button>
      )}
    </div>
  )
}

export default Error