import usersData from "@/services/mockData/users.json"
import jobSeekersData from "@/services/mockData/jobSeekers.json"
import employersData from "@/services/mockData/employers.json"

class UserService {
  constructor() {
    this.users = [...usersData]
    this.jobSeekers = [...jobSeekersData]
    this.employers = [...employersData]
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200))
  }

  async getAll() {
    await this.delay()
    return [...this.users]
  }

  async getById(id) {
    await this.delay()
    const user = this.users.find(u => u.Id === id)
    if (!user) throw new Error("User not found")
    return { ...user }
  }

  async create(userData) {
    await this.delay()
    
    const newId = Math.max(...this.users.map(u => u.Id)) + 1
    const newUser = {
      Id: newId,
      email: userData.email,
      password: userData.password,
      role: userData.role,
      createdAt: new Date().toISOString(),
      isActive: true,
      lastLogin: new Date().toISOString()
    }
    
    this.users.push(newUser)
    return { ...newUser }
  }

  async update(id, userData) {
    await this.delay()
    
    const index = this.users.findIndex(u => u.Id === id)
    if (index === -1) throw new Error("User not found")
    
    this.users[index] = { ...this.users[index], ...userData }
    return { ...this.users[index] }
  }

  async delete(id) {
    await this.delay()
    
    const index = this.users.findIndex(u => u.Id === id)
    if (index === -1) throw new Error("User not found")
    
    this.users.splice(index, 1)
    return true
  }

  async login(credentials) {
    await this.delay()
    
    const user = this.users.find(u => 
      u.email === credentials.email && 
      u.password === credentials.password && 
      u.isActive
    )
    
    if (!user) throw new Error("Invalid credentials")
    
    // Update last login
    user.lastLogin = new Date().toISOString()
    return { ...user }
  }

  async getJobSeekerProfile(userId) {
    await this.delay()
    const profile = this.jobSeekers.find(js => js.userId === userId.toString())
    return profile ? { ...profile } : null
  }

  async updateJobSeekerProfile(userId, profileData) {
    await this.delay()
    
    const index = this.jobSeekers.findIndex(js => js.userId === userId.toString())
    if (index === -1) {
      // Create new profile
      const newProfile = {
        Id: Math.max(...this.jobSeekers.map(js => js.Id), 0) + 1,
        userId: userId.toString(),
        ...profileData
      }
      this.jobSeekers.push(newProfile)
      return { ...newProfile }
    } else {
      // Update existing profile
      this.jobSeekers[index] = { ...this.jobSeekers[index], ...profileData }
      return { ...this.jobSeekers[index] }
    }
  }

  async getEmployerProfile(userId) {
    await this.delay()
    const profile = this.employers.find(emp => emp.userId === userId.toString())
    return profile ? { ...profile } : null
  }

  async updateEmployerProfile(userId, profileData) {
    await this.delay()
    
    const index = this.employers.findIndex(emp => emp.userId === userId.toString())
    if (index === -1) {
      // Create new profile
      const newProfile = {
        Id: Math.max(...this.employers.map(emp => emp.Id), 0) + 1,
        userId: userId.toString(),
        ...profileData
      }
      this.employers.push(newProfile)
      return { ...newProfile }
    } else {
      // Update existing profile
      this.employers[index] = { ...this.employers[index], ...profileData }
      return { ...this.employers[index] }
    }
  }
}

export const userService = new UserService()