import React, { useState, useEffect } from "react"
import { toast } from "react-toastify"
import { useUser } from "@/hooks/useUser"
import Button from "@/components/atoms/Button"
import Card from "@/components/atoms/Card"
import Badge from "@/components/atoms/Badge"
import Select from "@/components/atoms/Select"
import FormField from "@/components/molecules/FormField"
import ApplicationList from "@/components/organisms/ApplicationList"
import ApperIcon from "@/components/ApperIcon"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import { applicationService } from "@/services/api/applicationService"
import { jobService } from "@/services/api/jobService"

const ApplicationsPage = () => {
  const { currentUser, isJobSeeker, isEmployer } = useUser()
  const [applications, setApplications] = useState([])
  const [filteredApplications, setFilteredApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [selectedApplication, setSelectedApplication] = useState(null)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [newStatus, setNewStatus] = useState("")
  const [employerNotes, setEmployerNotes] = useState("")

  const statusOptions = [
    { value: "", label: "All Statuses" },
    { value: "applied", label: "Applied" },
    { value: "reviewed", label: "Reviewed" },
    { value: "shortlisted", label: "Shortlisted" },
    { value: "rejected", label: "Rejected" },
    { value: "hired", label: "Hired" }
  ]

  const loadApplications = async () => {
    try {
      setLoading(true)
      setError("")
      
      let apps = []
      
      if (isJobSeeker) {
        apps = await applicationService.getByJobSeeker(currentUser.Id)
      } else if (isEmployer) {
        // Get all applications for jobs posted by this employer
        const allJobs = await jobService.getAll()
        const employerJobs = allJobs.filter(job => job.employerId === currentUser.Id)
        const allApplications = await applicationService.getAll()
        
        apps = allApplications.filter(app => 
          employerJobs.some(job => job.Id === app.jobId)
        )
      } else {
        // Admin - get all applications
        apps = await applicationService.getAll()
      }
      
      setApplications(apps)
      setFilteredApplications(apps)
    } catch (err) {
      console.error("Applications loading error:", err)
      setError("Failed to load applications")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (currentUser?.Id) {
      loadApplications()
    }
  }, [currentUser])

  useEffect(() => {
    filterApplications()
  }, [applications, statusFilter])

  const filterApplications = () => {
    let filtered = [...applications]
    
    if (statusFilter) {
      filtered = filtered.filter(app => app.status === statusFilter)
    }
    
    setFilteredApplications(filtered)
  }

  const handleViewApplication = (application) => {
    setSelectedApplication(application)
    toast.info(`Viewing application for ${application.jobTitle}`)
  }

  const handleUpdateApplication = (application) => {
    setSelectedApplication(application)
    setNewStatus(application.status)
    setEmployerNotes(application.employerNotes || "")
    setShowUpdateModal(true)
  }

  const handleStatusUpdate = async (e) => {
    e.preventDefault()
    try {
      await applicationService.update(selectedApplication.Id, {
        ...selectedApplication,
        status: newStatus,
        employerNotes: employerNotes
      })
      
      toast.success("Application status updated successfully!")
      setShowUpdateModal(false)
      setSelectedApplication(null)
      loadApplications()
    } catch (err) {
      console.error("Status update error:", err)
      toast.error("Failed to update application status")
    }
  }

  const getStats = () => {
    const total = applications.length
    const applied = applications.filter(app => app.status === "applied").length
    const reviewed = applications.filter(app => app.status === "reviewed").length
    const shortlisted = applications.filter(app => app.status === "shortlisted").length
    const hired = applications.filter(app => app.status === "hired").length
    const rejected = applications.filter(app => app.status === "rejected").length
    
    return { total, applied, reviewed, shortlisted, hired, rejected }
  }

  if (loading) return <Loading message="Loading applications..." />
  if (error) return <Error message={error} onRetry={loadApplications} />

  const stats = getStats()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isJobSeeker ? "My Applications" : "Application Management"}
          </h1>
          <p className="text-gray-600 mt-2">
            {isJobSeeker 
              ? "Track the status of your job applications"
              : "Manage applications received for your job postings"
            }
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="text-center">
          <p className="text-2xl font-bold text-primary">{stats.total}</p>
          <p className="text-sm text-gray-600">Total</p>
        </Card>
        
        <Card className="text-center">
          <p className="text-2xl font-bold text-blue-600">{stats.applied}</p>
          <p className="text-sm text-gray-600">Applied</p>
        </Card>
        
        <Card className="text-center">
          <p className="text-2xl font-bold text-yellow-600">{stats.reviewed}</p>
          <p className="text-sm text-gray-600">Reviewed</p>
        </Card>
        
        <Card className="text-center">
          <p className="text-2xl font-bold text-accent">{stats.shortlisted}</p>
          <p className="text-sm text-gray-600">Shortlisted</p>
        </Card>
        
        <Card className="text-center">
          <p className="text-2xl font-bold text-success">{stats.hired}</p>
          <p className="text-sm text-gray-600">Hired</p>
        </Card>
        
        <Card className="text-center">
          <p className="text-2xl font-bold text-error">{stats.rejected}</p>
          <p className="text-sm text-gray-600">Rejected</p>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <ApperIcon name="Filter" size={20} className="text-gray-600" />
            <FormField label="Filter by Status" className="mb-0">
              <Select
                options={statusOptions}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="min-w-[200px]"
              />
            </FormField>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Showing {filteredApplications.length} of {applications.length} applications</span>
          </div>
        </div>
      </Card>

      {/* Applications List */}
      <ApplicationList
        applications={filteredApplications}
        onView={handleViewApplication}
        onUpdate={isEmployer ? handleUpdateApplication : undefined}
        showActions={true}
      />

      {/* Update Status Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Update Application Status</h2>
              <button
                onClick={() => setShowUpdateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <ApperIcon name="X" size={20} />
              </button>
            </div>
            
            <form onSubmit={handleStatusUpdate} className="space-y-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Application Details</h3>
                <p className="text-sm text-gray-600">
                  <strong>Job:</strong> {selectedApplication?.jobTitle}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Current Status:</strong> 
                  <Badge variant="primary" className="ml-2 capitalize">
                    {selectedApplication?.status}
                  </Badge>
                </p>
              </div>
              
              <FormField label="New Status" required>
                <Select
                  options={statusOptions.filter(opt => opt.value)}
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  required
                />
              </FormField>
              
              <FormField label="Notes (Optional)">
                <textarea
                  className="form-input"
                  rows={3}
                  value={employerNotes}
                  onChange={(e) => setEmployerNotes(e.target.value)}
                  placeholder="Add any notes about this status update..."
                />
              </FormField>
              
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowUpdateModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  Update Status
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  )
}

export default ApplicationsPage