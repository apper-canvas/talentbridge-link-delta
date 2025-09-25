import React from "react"
import { cn } from "@/utils/cn"
import JobCard from "@/components/molecules/JobCard"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"

const JobList = ({ 
  jobs = [], 
  loading = false, 
  error = null,
  onApply,
  onView,
  showCompany = true,
  className,
  ...props 
}) => {
  if (loading) return <Loading />
  if (error) return <Error message={error} />
  if (jobs.length === 0) return <Empty message="No jobs found" />

  return (
    <div className={cn("grid gap-6 md:grid-cols-2 lg:grid-cols-3", className)} {...props}>
      {jobs.map((job) => (
        <JobCard
          key={job.Id}
          job={job}
          onApply={onApply}
          onView={onView}
          showCompany={showCompany}
        />
      ))}
    </div>
  )
}

export default JobList