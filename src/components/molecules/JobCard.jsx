import React from "react"
import { cn } from "@/utils/cn"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import ApperIcon from "@/components/ApperIcon"
import { format } from "date-fns"

const JobCard = ({ 
  job, 
  onApply, 
  onView, 
  showCompany = true,
  className,
  ...props 
}) => {
  const formatSalary = (min, max) => {
    if (!min && !max) return "Salary not specified"
    if (!max) return `$${min?.toLocaleString()}+`
    if (!min) return `Up to $${max?.toLocaleString()}`
    return `$${min?.toLocaleString()} - $${max?.toLocaleString()}`
  }

  return (
    <Card 
      hoverable 
      className={cn("cursor-pointer transition-all duration-200", className)} 
      onClick={() => onView && onView(job)}
      {...props}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-1">{job.title}</h3>
          {showCompany && (
            <p className="text-gray-600 font-medium">{job.companyName}</p>
          )}
        </div>
        <Badge variant={job.status === "active" ? "success" : "default"}>
          {job.status}
        </Badge>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-2 text-gray-600">
          <ApperIcon name="MapPin" size={16} />
          <span className="text-sm">{job.location}</span>
        </div>
        
        <div className="flex items-center gap-2 text-gray-600">
          <ApperIcon name="DollarSign" size={16} />
          <span className="text-sm">{formatSalary(job.salaryMin, job.salaryMax)}</span>
        </div>
        
        <div className="flex items-center gap-2 text-gray-600">
          <ApperIcon name="Clock" size={16} />
          <span className="text-sm capitalize">{job.jobType}</span>
        </div>
        
        <div className="flex items-center gap-2 text-gray-600">
          <ApperIcon name="Calendar" size={16} />
          <span className="text-sm">Posted {format(new Date(job.postedDate), "MMM d, yyyy")}</span>
        </div>
      </div>

      <p className="text-gray-700 text-sm mb-6 line-clamp-3">
        {job.description}
      </p>

      <div className="flex gap-3">
        <Button 
          onClick={(e) => {
            e.stopPropagation()
            onView && onView(job)
          }}
          variant="outline"
          size="sm"
          className="flex-1"
        >
          View Details
        </Button>
        {onApply && (
          <Button 
            onClick={(e) => {
              e.stopPropagation()
              onApply(job)
            }}
            size="sm"
            className="flex-1"
          >
            Apply Now
          </Button>
        )}
      </div>
    </Card>
  )
}

export default JobCard