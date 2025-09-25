import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { useUser } from "@/hooks/useUser"
import StatsCard from "@/components/molecules/StatsCard"
import ApplicationCard from "@/components/molecules/ApplicationCard"
import Button from "@/components/atoms/Button"
import Card from "@/components/atoms/Card"
import Badge from "@/components/atoms/Badge"
import FormField from "@/components/molecules/FormField"
import Input from "@/components/atoms/Input"
import Select from "@/components/atoms/Select"
import Textarea from "@/components/atoms/Textarea"
import ApperIcon from "@/components/ApperIcon"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import { jobService } from "@/services/api/jobService"
import { applicationService } from "@/services/api/applicationService"

const EmployerDashboard = () => {
  const navigate = useNavigate()
  const { currentUser, userProfile } = useUser()
  const [stats, setStats] = useState({ activeJobs: 0, totalApplications: 0, shortlisted: 0 })
  const [recentApplications, setRecentApplications] = useState([])
  const [myJobs, setMyJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showJobForm, setShowJobForm] = useState(false)
  const [jobFormData, setJobFormData] = useState({
    title: "",
    description: "",
    requirements: "",
    location: "",
    salaryMin: "",
    salaryMax: "",
    jobType: "full-time",
    experienceLevel: "mid",
    deadline: ""
  })

  const jobTypes = [
    { value: "full-time", label: "Full Time" },
    { value: "part-time", label: "Part Time" },
    { value: "contract", label: "Contract" },
    { value: "freelance", label: "Freelance" },
    { value: "internship", label: "Internship" }
  ]

  const experienceLevels = [
    { value: "entry", label: "Entry Level" },
    { value: "mid", label: "Mid Level" },
    { value: "senior", label: "Senior Level" },
    { value: "executive", label: "Executive" }
  ]

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError("")
      
      // Load jobs posted by this employer
      const allJobs = await jobService.getAll()
      const employerJobs = allJobs.filter(job => job.employerId === currentUser.Id)
      setMyJobs(employerJobs.slice(0, 5))
      
      // Load applications for employer's jobs
      const allApplications = await applicationService.getAll()
      const employerApplications = allApplications.filter(app => 
        employerJobs.some(job => job.Id === app.jobId)
      )
      setRecentApplications(employerApplications.slice(0, 5))
      
      // Calculate stats
      const activeJobsCount = employerJobs.filter(job => job.status === "active").length
      const totalApplicationsCount = employerApplications.length
      const shortlistedCount = employerApplications.filter(app => app.status === "shortlisted").length
      
      setStats({
        activeJobs: activeJobsCount,
        totalApplications: totalApplicationsCount,
        shortlisted: shortlistedCount
      })
      
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

  const handleCreateJob = async (e) => {
    e.preventDefault()
    try {
      await jobService.create({
        ...jobFormData,
        employerId: currentUser.Id,
        companyName: userProfile?.companyName || "Your Company",
        postedDate: new Date().toISOString(),
        status: "active",
        salaryMin: jobFormData.salaryMin ? parseInt(jobFormData.salaryMin) : null,
        salaryMax: jobFormData.salaryMax ? parseInt(jobFormData.salaryMax) : null
      })
      
      toast.success("Job posted successfully!")
      setShowJobForm(false)
      setJobFormData({
        title: "",
        description: "",
        requirements: "",
        location: "",
        salaryMin: "",
        salaryMax: "",
        jobType: "full-time",
        experienceLevel: "mid",
        deadline: ""
      })
      loadDashboardData()
    } catch (err) {
      console.error("Job creation error:", err)
      toast.error("Failed to create job")
    }
  }

  const handleUpdateApplicationStatus = async (application, newStatus) => {
    try {
      await applicationService.update(application.Id, {
        ...application,
        status: newStatus,
        employerNotes: `Status updated to ${newStatus}`
      })
      
      toast.success(`Application status updated to ${newStatus}`)
      loadDashboardData()
    } catch (err) {
      console.error("Status update error:", err)
      toast.error("Failed to update status")
    }
  }

  const handleViewApplication = (application) => {
    toast.info(`Viewing application from candidate for ${application.jobTitle}`)
  }

  if (loading) return <Loading message="Loading your dashboard..." />
  if (error) return <Error message={error} onRetry={loadDashboardData} />

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Employer Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {userProfile?.companyName || "Employer"}!</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate("/applications")}>
            <ApperIcon name="FileText" size={16} className="mr-2" />
            All Applications
          </Button>
          <Button onClick={() => setShowJobForm(true)}>
            <ApperIcon name="Plus" size={16} className="mr-2" />
            Post Job
          </Button>
        </div>
      </div>

      {/* Profile Completion Alert */}
      {!userProfile?.companyName && (
        <Card className="border-l-4 border-l-warning bg-warning/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <ApperIcon name="AlertCircle" size={24} className="text-warning" />
              <div>
                <h3 className="font-semibold text-gray-900">Complete Your Company Profile</h3>
                <p className="text-gray-600">Add company details to attract better candidates</p>
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
          title="Active Job Posts"
          value={stats.activeJobs}
          icon="Briefcase"
          trend="up"
          trendValue="+2 this week"
        />
        <StatsCard
          title="Total Applications"
          value={stats.totalApplications}
          icon="Users"
          trend="up"
          trendValue="+15% this week"
        />
        <StatsCard
          title="Shortlisted Candidates"
          value={stats.shortlisted}
          icon="Star"
          trend="up"
          trendValue="+8% this week"
        />
      </div>

      {/* Job Creation Form */}
      {showJobForm && (
        <Card>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Post New Job</h2>
            <Button variant="ghost" onClick={() => setShowJobForm(false)}>
              <ApperIcon name="X" size={20} />
            </Button>
          </div>
          
          <form onSubmit={handleCreateJob} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="Job Title" required>
                <Input
                  value={jobFormData.title}
                  onChange={(e) => setJobFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. Senior Software Engineer"
                  required
                />
              </FormField>
              
              <FormField label="Location" required>
                <Input
                  value={jobFormData.location}
                  onChange={(e) => setJobFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="e.g. New York, NY"
                  required
                />
              </FormField>
            </div>
            
            <FormField label="Job Description" required>
              <Textarea
                value={jobFormData.description}
                onChange={(e) => setJobFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the role, responsibilities, and what you're looking for..."
                rows={4}
                required
              />
            </FormField>
            
            <FormField label="Requirements" required>
              <Textarea
                value={jobFormData.requirements}
                onChange={(e) => setJobFormData(prev => ({ ...prev, requirements: e.target.value }))}
                placeholder="List the skills, experience, and qualifications required..."
                rows={3}
                required
              />
            </FormField>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <FormField label="Job Type">
                <Select
                  options={jobTypes}
                  value={jobFormData.jobType}
                  onChange={(e) => setJobFormData(prev => ({ ...prev, jobType: e.target.value }))}
                />
              </FormField>
              
              <FormField label="Experience Level">
                <Select
                  options={experienceLevels}
                  value={jobFormData.experienceLevel}
                  onChange={(e) => setJobFormData(prev => ({ ...prev, experienceLevel: e.target.value }))}
                />
              </FormField>
              
              <FormField label="Min Salary">
                <Input
                  type="number"
                  value={jobFormData.salaryMin}
                  onChange={(e) => setJobFormData(prev => ({ ...prev, salaryMin: e.target.value }))}
                  placeholder="50000"
                />
              </FormField>
              
              <FormField label="Max Salary">
                <Input
                  type="number"
                  value={jobFormData.salaryMax}
                  onChange={(e) => setJobFormData(prev => ({ ...prev, salaryMax: e.target.value }))}
                  placeholder="80000"
                />
              </FormField>
            </div>
            
            <FormField label="Application Deadline">
              <Input
                type="date"
                value={jobFormData.deadline}
                onChange={(e) => setJobFormData(prev => ({ ...prev, deadline: e.target.value }))}
              />
            </FormField>
            
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setShowJobForm(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Post Job
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Recent Applications */}
      <Card>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ApperIcon name="FileText" size={24} />
            Recent Applications
          </h2>
          <Button variant="outline" onClick={() => navigate("/applications")}>
            View All
          </Button>
        </div>
        
        {recentApplications.length > 0 ? (
          <div className="space-y-4">
            {recentApplications.map((application) => (
              <div key={application.Id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{application.jobTitle}</h3>
                    <p className="text-gray-600">Application ID: {application.Id}</p>
                  </div>
                  <Badge variant={application.status === "applied" ? "primary" : application.status === "shortlisted" ? "accent" : "default"}>
                    {application.status}
                  </Badge>
                </div>
                
                {application.coverLetter && (
                  <p className="text-gray-700 text-sm mb-4 line-clamp-2">{application.coverLetter}</p>
                )}
                
                <div className="flex gap-2 flex-wrap">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleViewApplication(application)}
                  >
                    View Details
                  </Button>
                  {application.status === "applied" && (
                    <Button
                      size="sm"
                      variant="accent"
                      onClick={() => handleUpdateApplicationStatus(application, "shortlisted")}
                    >
                      Shortlist
                    </Button>
                  )}
                  {application.status === "shortlisted" && (
                    <Button
                      size="sm"
                      onClick={() => handleUpdateApplicationStatus(application, "hired")}
                    >
                      Hire
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Empty 
            message="No applications yet"
            description="Applications will appear here when candidates apply to your jobs"
            actionLabel="Post a Job"
            onAction={() => setShowJobForm(true)}
            icon="FileText"
          />
        )}
      </Card>

      {/* My Job Posts */}
      <Card>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ApperIcon name="Briefcase" size={24} />
            My Job Posts
          </h2>
        </div>
        
        {myJobs.length > 0 ? (
          <div className="space-y-4">
            {myJobs.map((job) => (
              <div key={job.Id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                    <p className="text-gray-600">{job.location} • {job.jobType}</p>
                  </div>
                  <Badge variant={job.status === "active" ? "success" : "default"}>
                    {job.status}
                  </Badge>
                </div>
                
                <p className="text-gray-700 text-sm mb-4 line-clamp-2">{job.description}</p>
                
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>Posted: {new Date(job.postedDate).toLocaleDateString()}</span>
                  <span>Applications: {recentApplications.filter(app => app.jobId === job.Id).length}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Empty 
            message="No jobs posted yet"
            description="Start by posting your first job to attract candidates"
            actionLabel="Post a Job"
            onAction={() => setShowJobForm(true)}
            icon="Briefcase"
          />
        )}
      </Card>
    </div>
  )
}

export default EmployerDashboard