import React, { useState, useEffect } from "react"
import { toast } from "react-toastify"
import { useUser } from "@/hooks/useUser"
import SearchBar from "@/components/molecules/SearchBar"
import FilterSidebar from "@/components/molecules/FilterSidebar"
import JobList from "@/components/organisms/JobList"
import Button from "@/components/atoms/Button"
import Card from "@/components/atoms/Card"
import ApperIcon from "@/components/ApperIcon"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import { jobService } from "@/services/api/jobService"
import { applicationService } from "@/services/api/applicationService"

const JobSearch = () => {
  const { currentUser } = useUser()
  const [jobs, setJobs] = useState([])
  const [filteredJobs, setFilteredJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState({
    location: "",
    jobType: "",
    experienceLevel: "",
    industry: "",
    salaryMin: "",
    salaryMax: ""
  })
  const [showFilters, setShowFilters] = useState(false)

  const loadJobs = async () => {
    try {
      setLoading(true)
      setError("")
      
      const allJobs = await jobService.getAll()
      const activeJobs = allJobs.filter(job => job.status === "active")
      
      setJobs(activeJobs)
      setFilteredJobs(activeJobs)
    } catch (err) {
      console.error("Jobs loading error:", err)
      setError("Failed to load jobs")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadJobs()
  }, [])

  useEffect(() => {
    filterJobs()
  }, [jobs, searchTerm, filters])

  const filterJobs = () => {
    let filtered = [...jobs]

    // Search term filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(term) ||
        job.companyName.toLowerCase().includes(term) ||
        job.description.toLowerCase().includes(term) ||
        job.location.toLowerCase().includes(term)
      )
    }

    // Location filter
    if (filters.location.trim()) {
      filtered = filtered.filter(job =>
        job.location.toLowerCase().includes(filters.location.toLowerCase())
      )
    }

    // Job type filter
    if (filters.jobType) {
      filtered = filtered.filter(job => job.jobType === filters.jobType)
    }

    // Experience level filter
    if (filters.experienceLevel) {
      filtered = filtered.filter(job => job.experienceLevel === filters.experienceLevel)
    }

    // Salary filters
    if (filters.salaryMin) {
      const minSalary = parseInt(filters.salaryMin)
      filtered = filtered.filter(job => 
        job.salaryMin && job.salaryMin >= minSalary
      )
    }

    if (filters.salaryMax) {
      const maxSalary = parseInt(filters.salaryMax)
      filtered = filtered.filter(job => 
        job.salaryMax && job.salaryMax <= maxSalary
      )
    }

    setFilteredJobs(filtered)
  }

  const handleSearch = (term) => {
    setSearchTerm(term)
  }

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters)
  }

  const handleClearFilters = () => {
    setFilters({
      location: "",
      jobType: "",
      experienceLevel: "",
      industry: "",
      salaryMin: "",
      salaryMax: ""
    })
    setSearchTerm("")
  }

  const handleApplyToJob = async (job) => {
    if (!currentUser) {
      toast.error("Please sign in to apply for jobs")
      return
    }

    if (currentUser.role !== "jobSeeker") {
      toast.error("Only job seekers can apply for jobs")
      return
    }

    try {
      // Check if already applied
      const existingApplications = await applicationService.getByJobSeeker(currentUser.Id)
      const alreadyApplied = existingApplications.some(app => app.jobId === job.Id)
      
      if (alreadyApplied) {
        toast.info("You have already applied to this job")
        return
      }

      await applicationService.create({
        jobId: job.Id,
        jobSeekerId: currentUser.Id,
        jobTitle: job.title,
        companyName: job.companyName,
        location: job.location,
        coverLetter: `I am very interested in the ${job.title} position at ${job.companyName}. I believe my skills and experience make me a great fit for this role.`,
        appliedDate: new Date().toISOString(),
        status: "applied"
      })
      
      toast.success("Application submitted successfully!")
    } catch (err) {
      console.error("Application error:", err)
      toast.error("Failed to submit application")
    }
  }

  const handleViewJob = (job) => {
    toast.info(`Viewing details for ${job.title} at ${job.companyName}`)
  }

  if (loading) return <Loading message="Loading job opportunities..." />
  if (error) return <Error message={error} onRetry={loadJobs} />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Find Your Next Opportunity</h1>
          <p className="text-gray-600 mt-2">Discover {filteredJobs.length} job openings</p>
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="lg:hidden"
        >
          <ApperIcon name="Filter" size={16} className="mr-2" />
          Filters
        </Button>
      </div>

      {/* Search Bar */}
      <Card>
        <SearchBar
          placeholder="Search jobs by title, company, or keywords..."
          onSearch={handleSearch}
        />
      </Card>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className={`lg:col-span-1 ${showFilters ? "block" : "hidden lg:block"}`}>
          <FilterSidebar
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClear={handleClearFilters}
          />
        </div>

        {/* Job Results */}
        <div className="lg:col-span-3">
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">
              {searchTerm && (
                <span>Results for "{searchTerm}" • </span>
              )}
              {filteredJobs.length} jobs found
            </p>
            
            {(searchTerm || Object.values(filters).some(f => f)) && (
              <Button variant="outline" size="sm" onClick={handleClearFilters}>
                <ApperIcon name="X" size={14} className="mr-1" />
                Clear All
              </Button>
            )}
          </div>

          <JobList
            jobs={filteredJobs}
            onApply={handleApplyToJob}
            onView={handleViewJob}
            showCompany={true}
          />
        </div>
      </div>
    </div>
  )
}

export default JobSearch