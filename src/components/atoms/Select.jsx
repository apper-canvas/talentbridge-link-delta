import React from "react"
import { cn } from "@/utils/cn"

const Select = React.forwardRef(({ 
  className, 
  options = [],
  placeholder = "Select an option",
  error,
  ...props 
}, ref) => {
  return (
    <select
      className={cn(
        "form-input",
        error && "border-error focus:ring-error",
        className
      )}
      ref={ref}
      {...props}
    >
      <option value="">{placeholder}</option>
      {options.map((option, index) => (
        <option key={index} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
})

Select.displayName = "Select"

export default Select