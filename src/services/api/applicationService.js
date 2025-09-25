import applicationsData from "@/services/mockData/applications.json"

class ApplicationService {
  constructor() {
    this.applications = [...applicationsData]
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200))
  }

  async getAll() {
    await this.delay()
    return [...this.applications]
  }

  async getById(id) {
    await this.delay()
    const application = this.applications.find(a => a.Id === id)
    if (!application) throw new Error("Application not found")
    return { ...application }
  }

  async create(applicationData) {
    await this.delay()
    
    const newId = Math.max(...this.applications.map(a => a.Id)) + 1
    const newApplication = {
      Id: newId,
      ...applicationData
    }
    
    this.applications.push(newApplication)
    return { ...newApplication }
  }

  async update(id, applicationData) {
    await this.delay()
    
    const index = this.applications.findIndex(a => a.Id === id)
    if (index === -1) throw new Error("Application not found")
    
    this.applications[index] = { ...this.applications[index], ...applicationData }
    return { ...this.applications[index] }
  }

  async delete(id) {
    await this.delay()
    
    const index = this.applications.findIndex(a => a.Id === id)
    if (index === -1) throw new Error("Application not found")
    
    this.applications.splice(index, 1)
    return true
  }

  async getByJobSeeker(jobSeekerId) {
    await this.delay()
    return this.applications
      .filter(a => a.jobSeekerId === jobSeekerId)
      .map(a => ({ ...a }))
  }

  async getByJob(jobId) {
    await this.delay()
    return this.applications
      .filter(a => a.jobId === jobId)
      .map(a => ({ ...a }))
  }

  async getByStatus(status) {
    await this.delay()
    return this.applications
      .filter(a => a.status === status)
      .map(a => ({ ...a }))
  }
}

export const applicationService = new ApplicationService()