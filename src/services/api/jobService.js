import jobsData from "@/services/mockData/jobs.json"

class JobService {
  constructor() {
    this.jobs = [...jobsData]
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200))
  }

  async getAll() {
    await this.delay()
    return [...this.jobs]
  }

  async getById(id) {
    await this.delay()
    const job = this.jobs.find(j => j.Id === id)
    if (!job) throw new Error("Job not found")
    return { ...job }
  }

  async create(jobData) {
    await this.delay()
    
    const newId = Math.max(...this.jobs.map(j => j.Id)) + 1
    const newJob = {
      Id: newId,
      ...jobData
    }
    
    this.jobs.push(newJob)
    return { ...newJob }
  }

  async update(id, jobData) {
    await this.delay()
    
    const index = this.jobs.findIndex(j => j.Id === id)
    if (index === -1) throw new Error("Job not found")
    
    this.jobs[index] = { ...this.jobs[index], ...jobData }
    return { ...this.jobs[index] }
  }

  async delete(id) {
    await this.delay()
    
    const index = this.jobs.findIndex(j => j.Id === id)
    if (index === -1) throw new Error("Job not found")
    
    this.jobs.splice(index, 1)
    return true
  }

  async getByEmployer(employerId) {
    await this.delay()
    return this.jobs.filter(j => j.employerId === employerId).map(j => ({ ...j }))
  }

  async searchJobs(filters) {
    await this.delay()
    
    let filtered = [...this.jobs]
    
    if (filters.title) {
      filtered = filtered.filter(j => 
        j.title.toLowerCase().includes(filters.title.toLowerCase())
      )
    }
    
    if (filters.location) {
      filtered = filtered.filter(j => 
        j.location.toLowerCase().includes(filters.location.toLowerCase())
      )
    }
    
    if (filters.jobType) {
      filtered = filtered.filter(j => j.jobType === filters.jobType)
    }
    
    if (filters.experienceLevel) {
      filtered = filtered.filter(j => j.experienceLevel === filters.experienceLevel)
    }
    
    if (filters.salaryMin) {
      filtered = filtered.filter(j => j.salaryMin >= filters.salaryMin)
    }
    
    if (filters.salaryMax) {
      filtered = filtered.filter(j => j.salaryMax <= filters.salaryMax)
    }
    
    return filtered.map(j => ({ ...j }))
  }
}

export const jobService = new JobService()