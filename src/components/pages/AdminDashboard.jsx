import React, { useState, useEffect } from "react"
import { toast } from "react-toastify"
import StatsCard from "@/components/molecules/StatsCard"
import Button from "@/components/atoms/Button"
import Card from "@/components/atoms/Card"
import Badge from "@/components/atoms/Badge"
import ApperIcon from "@/components/ApperIcon"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import { userService } from "@/services/api/userService"
import { jobService } from "@/services/api/jobService"
import { applicationService } from "@/services/api/applicationService"

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalJobs: 0,
    totalApplications: 0,
    activeJobs: 0
  })
  const [recentUsers, setRecentUsers] = useState([])
  const [recentJobs, setRecentJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError("")
      
      // Load all data
      const [users, jobs, applications] = await Promise.all([
        userService.getAll(),
        jobService.getAll(),
        applicationService.getAll()
      ])
      
      // Calculate stats
      setStats({
        totalUsers: users.length,
        totalJobs: jobs.length,
        totalApplications: applications.length,
        activeJobs: jobs.filter(job => job.status === "active").length
      })
      
      // Get recent items
      setRecentUsers(users.slice(-5).reverse())
      setRecentJobs(jobs.slice(-5).reverse())
      
    } catch (err) {
      console.error("Admin dashboard loading error:", err)
      setError("Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [])

  const handleToggleUserStatus = async (user) => {
    try {
      await userService.update(user.Id, {
        ...user,
        isActive: !user.isActive
      })
      
      toast.success(`User ${user.isActive ? "deactivated" : "activated"} successfully`)
      loadDashboardData()
    } catch (err) {
      console.error("User status toggle error:", err)
      toast.error("Failed to update user status")
    }
  }

  const handleToggleJobStatus = async (job) => {
    try {
      const newStatus = job.status === "active" ? "inactive" : "active"
      await jobService.update(job.Id, {
        ...job,
        status: newStatus
      })
      
      toast.success(`Job ${newStatus === "active" ? "activated" : "deactivated"} successfully`)
      loadDashboardData()
    } catch (err) {
      console.error("Job status toggle error:", err)
      toast.error("Failed to update job status")
    }
  }

  if (loading) return <Loading message="Loading admin dashboard..." />
  if (error) return <Error message={error} onRetry={loadDashboardData} />

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Monitor and manage the TalentBridge platform</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Users"
          value={stats.totalUsers}
          icon="Users"
          trend="up"
          trendValue="+12% this month"
        />
        <StatsCard
          title="Active Jobs"
          value={stats.activeJobs}
          icon="Briefcase"
          trend="up"
          trendValue="+8% this month"
        />
        <StatsCard
          title="Total Applications"
          value={stats.totalApplications}
          icon="FileText"
          trend="up"
          trendValue="+25% this month"
        />
        <StatsCard
          title="Platform Health"
          value="98.5%"
          icon="Activity"
          trend="up"
          trendValue="Excellent"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Users */}
        <Card>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <ApperIcon name="Users" size={24} />
              Recent Users
            </h2>
            <Button variant="outline" size="sm">
              Manage Users
            </Button>
          </div>
          
          <div className="space-y-4">
            {recentUsers.map((user) => (
              <div key={user.Id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                    <ApperIcon name="User" size={16} className="text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{user.email}</p>
                    <p className="text-sm text-gray-600 capitalize">{user.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={user.isActive ? "success" : "error"}>
                    {user.isActive ? "Active" : "Inactive"}
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleToggleUserStatus(user)}
                  >
                    {user.isActive ? "Deactivate" : "Activate"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Jobs */}
        <Card>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <ApperIcon name="Briefcase" size={24} />
              Recent Jobs
            </h2>
            <Button variant="outline" size="sm">
              Manage Jobs
            </Button>
          </div>
          
          <div className="space-y-4">
            {recentJobs.map((job) => (
              <div key={job.Id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{job.title}</h3>
                  <p className="text-sm text-gray-600">{job.companyName} • {job.location}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Posted: {new Date(job.postedDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={job.status === "active" ? "success" : "default"}>
                    {job.status}
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleToggleJobStatus(job)}
                  >
                    {job.status === "active" ? "Deactivate" : "Activate"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* System Health */}
      <Card>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <ApperIcon name="Activity" size={24} />
          System Health & Metrics
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-success/10 rounded-lg">
            <ApperIcon name="CheckCircle" size={32} className="text-success mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900">System Status</h3>
            <p className="text-success font-medium">All Systems Operational</p>
          </div>
          
          <div className="text-center p-4 bg-primary/10 rounded-lg">
            <ApperIcon name="Database" size={32} className="text-primary mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900">Database Health</h3>
            <p className="text-primary font-medium">Excellent Performance</p>
          </div>
          
          <div className="text-center p-4 bg-accent/10 rounded-lg">
            <ApperIcon name="Shield" size={32} className="text-accent mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900">Security Status</h3>
            <p className="text-accent font-medium">Fully Protected</p>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default AdminDashboard