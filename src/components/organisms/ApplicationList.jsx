import React from "react"
import { cn } from "@/utils/cn"
import ApplicationCard from "@/components/molecules/ApplicationCard"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"

const ApplicationList = ({ 
  applications = [], 
  loading = false, 
  error = null,
  onView,
  onUpdate,
  showActions = true,
  className,
  ...props 
}) => {
  if (loading) return <Loading />
  if (error) return <Error message={error} />
  if (applications.length === 0) return <Empty message="No applications found" />

  return (
    <div className={cn("space-y-6", className)} {...props}>
      {applications.map((application) => (
        <ApplicationCard
          key={application.Id}
          application={application}
          onView={onView}
          onUpdate={onUpdate}
          showActions={showActions}
        />
      ))}
    </div>
  )
}

export default ApplicationList