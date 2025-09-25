import React from "react"
import { cn } from "@/utils/cn"

const FormField = ({ 
  label, 
  error, 
  children, 
  required = false,
  className,
  ...props 
}) => {
  return (
    <div className={cn("space-y-2", className)} {...props}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      {children}
      {error && (
        <p className="text-error text-sm mt-1">{error}</p>
      )}
    </div>
  )
}

export default FormField