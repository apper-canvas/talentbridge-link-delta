import React from "react"
import { cn } from "@/utils/cn"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import ApperIcon from "@/components/ApperIcon"
import { format } from "date-fns"

const ApplicationCard = ({ 
  application, 
  onView, 
  onUpdate,
  showActions = true,
  className,
  ...props 
}) => {
  const statusVariant = {
    applied: "primary",
    reviewed: "warning",
    shortlisted: "accent",
    rejected: "error",
    hired: "success"
  }

  return (
    <Card className={cn("transition-all duration-200", className)} {...props}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-1">{application.jobTitle}</h3>
          <p className="text-gray-600">{application.companyName}</p>
        </div>
        <Badge variant={statusVariant[application.status] || "default"}>
          {application.status}
        </Badge>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-gray-600">
          <ApperIcon name="Calendar" size={16} />
          <span className="text-sm">Applied {format(new Date(application.appliedDate), "MMM d, yyyy")}</span>
        </div>
        
        <div className="flex items-center gap-2 text-gray-600">
          <ApperIcon name="MapPin" size={16} />
          <span className="text-sm">{application.location}</span>
        </div>
      </div>

      {application.coverLetter && (
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Cover Letter:</p>
          <p className="text-gray-600 text-sm line-clamp-3">{application.coverLetter}</p>
        </div>
      )}

      {application.employerNotes && (
        <div className="mb-4 p-3 bg-gray-50 rounded-md">
          <p className="text-sm font-medium text-gray-700 mb-1">Employer Notes:</p>
          <p className="text-gray-600 text-sm">{application.employerNotes}</p>
        </div>
      )}

      {showActions && (
        <div className="flex gap-3">
          <Button 
            onClick={() => onView && onView(application)}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            View Details
          </Button>
          {onUpdate && (
            <Button 
              onClick={() => onUpdate(application)}
              size="sm"
              className="flex-1"
            >
              Update Status
            </Button>
          )}
        </div>
      )}
    </Card>
  )
}

export default ApplicationCard