import React from "react"
import { cn } from "@/utils/cn"

const Button = React.forwardRef(({ 
  className, 
  variant = "primary", 
  size = "default", 
  children, 
  ...props 
}, ref) => {
  const variants = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    accent: "btn-accent",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-700 hover:text-gray-900",
    outline: "border border-gray-300 hover:border-primary bg-transparent hover:bg-primary/5 text-gray-700 hover:text-primary"
  }

  const sizes = {
    sm: "px-3 py-2 text-sm",
    default: "px-6 py-3",
    lg: "px-8 py-4 text-lg",
  }

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  )
})

Button.displayName = "Button"

export default Button