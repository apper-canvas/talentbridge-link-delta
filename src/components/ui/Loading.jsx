import React from "react"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"

const Loading = ({ className, message = "Loading...", ...props }) => {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12", className)} {...props}>
      <div className="relative mb-4">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
        <ApperIcon 
          name="Briefcase" 
          size={20} 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-primary" 
        />
      </div>
      <p className="text-gray-600 font-medium">{message}</p>
      
      {/* Skeleton Cards */}
      <div className="w-full max-w-4xl mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-card p-6 animate-pulse">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="h-5 bg-gray-200 rounded mb-2 w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="h-6 bg-gray-200 rounded-full w-16"></div>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
            
            <div className="h-16 bg-gray-200 rounded mb-6"></div>
            
            <div className="flex gap-3">
              <div className="h-10 bg-gray-200 rounded flex-1"></div>
              <div className="h-10 bg-gray-200 rounded flex-1"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Loading