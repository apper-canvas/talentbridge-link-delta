import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { useUser } from "@/hooks/useUser"
import StatsCard from "@/components/molecules/StatsCard"
import JobCard from "@/components/molecules/JobCard"
import ApplicationCard from "@/components/molecules/ApplicationCard"
import Button from "@/components/atoms/Button"
import Card from "@/components/atoms/Card"
import ApperIcon from "@/components/ApperIcon"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import { jobService } from "@/services/api/jobService"
import { applicationService } from "@/services/api/applicationService"

const JobSeekerDashboard = () => {
  const navigate = useNavigate()
  const { currentUser, userProfile } = useUser()
  const [stats, setStats] = useState({ applied: 0, interviews: 0, offers: 0 })
  const [recentApplications, setRecentApplications] = useState([])
  const [recommendedJobs, setRecommendedJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError("")
      
      // Load applications
      const applications = await applicationService.getByJobSeeker(currentUser.Id)
      setRecentApplications(applications.slice(0, 3))
      
      // Calculate stats
      const appliedCount = applications.length
      const interviewCount = applications.filter(app => app.status === "shortlisted").length
      const offerCount = applications.filter(app => app.status === "hired").length
      
      setStats({
        applied: appliedCount,
        interviews: interviewCount,
        offers: offerCount
      })
      
      // Load recommended jobs (active jobs, limit to 6)
      const allJobs = await jobService.getAll()
      const activeJobs = allJobs.filter(job => job.status === "active").slice(0, 6)
      setRecommendedJobs(activeJobs)
      
    } catch (err) {
      console.error("Dashboard loading error:", err)
      setError("Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (currentUser?.Id) {
      loadDashboardData()
    }
  }, [currentUser])

  const handleApplyToJob = async (job) => {
    try {
      await applicationService.create({
        jobId: job.Id,
        jobSeekerId: currentUser.Id,
        jobTitle: job.title,
        companyName: job.companyName,
        location: job.location,
        coverLetter: `I am very interested in the ${job.title} position at ${job.companyName}.`,
        appliedDate: new Date().toISOString(),
        status: "applied"
      })
      
      toast.success("Application submitted successfully!")
      loadDashboardData() // Refresh data
    } catch (err) {
      console.error("Application error:", err)
      toast.error("Failed to submit application")
    }
  }

  const handleViewJob = (job) => {
    // In a real app, this would open a job detail modal or navigate to detail page
    toast.info(`Viewing details for ${job.title}`)
  }

  const handleViewApplication = (application) => {
    // In a real app, this would open application details
    toast.info(`Viewing application for ${application.jobTitle}`)
  }

  if (loading) return <Loading message="Loading your dashboard..." />
  if (error) return <Error message={error} onRetry={loadDashboardData} />

  const profileCompletionPercent = userProfile ? 
    Math.round(((userProfile.firstName ? 1 : 0) + 
                (userProfile.skills?.length > 0 ? 1 : 0) + 
                (userProfile.experience ? 1 : 0) + 
                (userProfile.resumeUrl ? 1 : 0)) / 4 * 100) : 0

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {userProfile?.firstName || "Job Seeker"}!</h1>
          <p className="text-gray-600 mt-2">Track your applications and discover new opportunities</p>
        </div>
        <Button onClick={() => navigate("/jobs")} className="flex items-center gap-2">
          <ApperIcon name="Search" size={16} />
          Find Jobs
        </Button>
      </div>

      {/* Profile Completion Alert */}
      {profileCompletionPercent < 100 && (
        <Card className="border-l-4 border-l-warning bg-warning/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <ApperIcon name="AlertCircle" size={24} className="text-warning" />
              <div>
                <h3 className="font-semibold text-gray-900">Complete Your Profile</h3>
                <p className="text-gray-600">Your profile is {profileCompletionPercent}% complete. A complete profile gets 3x more views!</p>
              </div>
            </div>
            <Button variant="outline" onClick={() => navigate("/profile")}>
              Complete Profile
            </Button>
          </div>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Applications Submitted"
          value={stats.applied}
          icon="FileText"
          trend="up"
          trendValue="+12% this week"
        />
        <StatsCard
          title="Interview Invites"
          value={stats.interviews}
          icon="Calendar"
          trend="up"
          trendValue="+5% this week"
        />
        <StatsCard
          title="Job Offers"
          value={stats.offers}
          icon="Award"
          trend="up"
          trendValue="+2 this month"
        />
      </div>

      {/* Recent Applications */}
      <Card>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ApperIcon name="Clock" size={24} />
            Recent Applications
          </h2>
          <Button variant="outline" onClick={() => navigate("/applications")}>
            View All
          </Button>
        </div>
        
        {recentApplications.length > 0 ? (
          <div className="space-y-4">
            {recentApplications.map((application) => (
              <ApplicationCard
                key={application.Id}
                application={application}
                onView={handleViewApplication}
                showActions={false}
              />
            ))}
          </div>
        ) : (
          <Empty 
            message="No applications yet"
            description="Start applying to jobs to see them here"
            actionLabel="Find Jobs"
            onAction={() => navigate("/jobs")}
            icon="FileText"
          />
        )}
      </Card>

      {/* Recommended Jobs */}
      <Card>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ApperIcon name="Star" size={24} />
            Recommended Jobs
          </h2>
          <Button variant="outline" onClick={() => navigate("/jobs")}>
            View All Jobs
          </Button>
        </div>
        
        {recommendedJobs.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {recommendedJobs.map((job) => (
              <JobCard
                key={job.Id}
                job={job}
                onApply={handleApplyToJob}
                onView={handleViewJob}
                showCompany={true}
              />
            ))}
          </div>
        ) : (
          <Empty 
            message="No recommended jobs"
            description="Complete your profile to get personalized job recommendations"
            actionLabel="Complete Profile"
            onAction={() => navigate("/profile")}
            icon="Briefcase"
          />
        )}
      </Card>
    </div>
  )
}

export default JobSeekerDashboard