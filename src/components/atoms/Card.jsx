import React from "react"
import { cn } from "@/utils/cn"

const Card = React.forwardRef(({ 
  className, 
  children, 
  hoverable = false,
  ...props 
}, ref) => {
  return (
    <div
      className={cn(
        "card p-6",
        hoverable && "cursor-pointer hover:shadow-card-hover transform hover:scale-[1.01]",
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  )
})

Card.displayName = "Card"

export default Card