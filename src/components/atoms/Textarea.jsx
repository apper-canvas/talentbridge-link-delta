import React from "react"
import { cn } from "@/utils/cn"

const Textarea = React.forwardRef(({ 
  className, 
  error,
  rows = 4,
  ...props 
}, ref) => {
  return (
    <textarea
      rows={rows}
      className={cn(
        "form-input resize-vertical min-h-[100px]",
        error && "border-error focus:ring-error",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})

Textarea.displayName = "Textarea"

export default Textarea