class UserService {
  constructor() {
    this.userTableName = 'user_c'
    this.jobSeekerTableName = 'job_seeker_c'
    this.employerTableName = 'employer_c'
  }

  getApperClient() {
    const { ApperClient } = window.ApperSDK
    return new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "role_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "is_active_c"}},
          {"field": {"Name": "last_login_c"}}
        ],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      }
      
      const apperClient = this.getApperClient()
      const response = await apperClient.fetchRecords(this.userTableName, params)
      
      if (!response.success) {
        console.error(response.message)
        return []
      }
      
      return response.data || []
    } catch (error) {
      console.error("Error fetching users:", error?.response?.data?.message || error)
      return []
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "role_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "is_active_c"}},
          {"field": {"Name": "last_login_c"}}
        ]
      }
      
      const apperClient = this.getApperClient()
      const response = await apperClient.getRecordById(this.userTableName, id, params)
      
      if (!response?.data) {
        return null
      }
      
      return response.data
    } catch (error) {
      console.error(`Error fetching user ${id}:`, error?.response?.data?.message || error)
      return null
    }
  }

  async create(userData) {
    try {
      const params = {
        records: [{
          Name: userData.email_c || userData.Name,
          email_c: userData.email_c,
          password_c: userData.password_c,
          role_c: userData.role_c,
          created_at_c: new Date().toISOString(),
          is_active_c: true,
          last_login_c: new Date().toISOString()
        }]
      }
      
      const apperClient = this.getApperClient()
      const response = await apperClient.createRecord(this.userTableName, params)
      
      if (!response.success) {
        console.error(response.message)
        return null
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} records:`, failed)
        }
        return successful.length > 0 ? successful[0].data : null
      }
    } catch (error) {
      console.error("Error creating user:", error?.response?.data?.message || error)
      return null
    }
  }

  async update(id, userData) {
    try {
      const params = {
        records: [{
          Id: id,
          Name: userData.email_c || userData.Name,
          email_c: userData.email_c,
          role_c: userData.role_c,
          is_active_c: userData.is_active_c,
          last_login_c: userData.last_login_c
        }]
      }
      
      const apperClient = this.getApperClient()
      const response = await apperClient.updateRecord(this.userTableName, params)
      
      if (!response.success) {
        console.error(response.message)
        return null
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} records:`, failed)
        }
        return successful.length > 0 ? successful[0].data : null
      }
    } catch (error) {
      console.error("Error updating user:", error?.response?.data?.message || error)
      return null
    }
  }

  async delete(id) {
    try {
      const params = { 
        RecordIds: [id] 
      }
      
      const apperClient = this.getApperClient()
      const response = await apperClient.deleteRecord(this.userTableName, params)
      
      if (!response.success) {
        console.error(response.message)
        return false
      }
      
      return true
    } catch (error) {
      console.error("Error deleting user:", error?.response?.data?.message || error)
      return false
    }
  }

  async getJobSeekerProfile(userId) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "user_id_c"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "location_c"}},
          {"field": {"Name": "skills_c"}},
          {"field": {"Name": "experience_c"}},
          {"field": {"Name": "education_c"}},
          {"field": {"Name": "resume_url_c"}},
          {"field": {"Name": "profile_complete_c"}}
        ],
        where: [{"FieldName": "user_id_c", "Operator": "ExactMatch", "Values": [userId.toString()]}]
      }
      
      const apperClient = this.getApperClient()
      const response = await apperClient.fetchRecords(this.jobSeekerTableName, params)
      
      if (!response.success) {
        console.error(response.message)
        return null
      }
      
      return response.data && response.data.length > 0 ? response.data[0] : null
    } catch (error) {
      console.error("Error fetching job seeker profile:", error?.response?.data?.message || error)
      return null
    }
  }

  async updateJobSeekerProfile(userId, profileData) {
    try {
      // First check if profile exists
      const existingProfile = await this.getJobSeekerProfile(userId)
      
      if (existingProfile) {
        // Update existing profile
        const params = {
          records: [{
            Id: existingProfile.Id,
            Name: profileData.first_name_c || existingProfile.Name,
            user_id_c: userId.toString(),
            first_name_c: profileData.first_name_c,
            last_name_c: profileData.last_name_c,
            phone_c: profileData.phone_c,
            location_c: profileData.location_c,
            skills_c: profileData.skills_c,
            experience_c: profileData.experience_c,
            education_c: profileData.education_c,
            resume_url_c: profileData.resume_url_c,
            profile_complete_c: profileData.profile_complete_c
          }]
        }
        
        const apperClient = this.getApperClient()
        const response = await apperClient.updateRecord(this.jobSeekerTableName, params)
        
        if (!response.success) {
          console.error(response.message)
          return null
        }
        
        if (response.results) {
          const successful = response.results.filter(r => r.success)
          return successful.length > 0 ? successful[0].data : null
        }
      } else {
        // Create new profile
        const params = {
          records: [{
            Name: profileData.first_name_c,
            user_id_c: userId.toString(),
            first_name_c: profileData.first_name_c,
            last_name_c: profileData.last_name_c,
            phone_c: profileData.phone_c,
            location_c: profileData.location_c,
            skills_c: profileData.skills_c,
            experience_c: profileData.experience_c,
            education_c: profileData.education_c,
            resume_url_c: profileData.resume_url_c,
            profile_complete_c: profileData.profile_complete_c
          }]
        }
        
        const apperClient = this.getApperClient()
        const response = await apperClient.createRecord(this.jobSeekerTableName, params)
        
        if (!response.success) {
          console.error(response.message)
          return null
        }
        
        if (response.results) {
          const successful = response.results.filter(r => r.success)
          return successful.length > 0 ? successful[0].data : null
        }
      }
    } catch (error) {
      console.error("Error updating job seeker profile:", error?.response?.data?.message || error)
      return null
    }
  }

  async getEmployerProfile(userId) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "user_id_c"}},
          {"field": {"Name": "company_name_c"}},
          {"field": {"Name": "industry_c"}},
          {"field": {"Name": "company_size_c"}},
          {"field": {"Name": "website_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "logo_url_c"}},
          {"field": {"Name": "verification_status_c"}}
        ],
        where: [{"FieldName": "user_id_c", "Operator": "ExactMatch", "Values": [userId.toString()]}]
      }
      
      const apperClient = this.getApperClient()
      const response = await apperClient.fetchRecords(this.employerTableName, params)
      
      if (!response.success) {
        console.error(response.message)
        return null
      }
      
      return response.data && response.data.length > 0 ? response.data[0] : null
    } catch (error) {
      console.error("Error fetching employer profile:", error?.response?.data?.message || error)
      return null
    }
  }

  async updateEmployerProfile(userId, profileData) {
    try {
      // First check if profile exists
      const existingProfile = await this.getEmployerProfile(userId)
      
      if (existingProfile) {
        // Update existing profile
        const params = {
          records: [{
            Id: existingProfile.Id,
            Name: profileData.company_name_c || existingProfile.Name,
            user_id_c: userId.toString(),
            company_name_c: profileData.company_name_c,
            industry_c: profileData.industry_c,
            company_size_c: profileData.company_size_c,
            website_c: profileData.website_c,
            description_c: profileData.description_c,
            logo_url_c: profileData.logo_url_c,
            verification_status_c: profileData.verification_status_c
          }]
        }
        
        const apperClient = this.getApperClient()
        const response = await apperClient.updateRecord(this.employerTableName, params)
        
        if (!response.success) {
          console.error(response.message)
          return null
        }
        
        if (response.results) {
          const successful = response.results.filter(r => r.success)
          return successful.length > 0 ? successful[0].data : null
        }
      } else {
        // Create new profile
        const params = {
          records: [{
            Name: profileData.company_name_c,
            user_id_c: userId.toString(),
            company_name_c: profileData.company_name_c,
            industry_c: profileData.industry_c,
            company_size_c: profileData.company_size_c,
            website_c: profileData.website_c,
            description_c: profileData.description_c,
            logo_url_c: profileData.logo_url_c,
            verification_status_c: profileData.verification_status_c || "pending"
          }]
        }
        
        const apperClient = this.getApperClient()
        const response = await apperClient.createRecord(this.employerTableName, params)
        
        if (!response.success) {
          console.error(response.message)
          return null
        }
        
        if (response.results) {
          const successful = response.results.filter(r => r.success)
          return successful.length > 0 ? successful[0].data : null
        }
      }
    } catch (error) {
      console.error("Error updating employer profile:", error?.response?.data?.message || error)
      return null
    }
  }
}

export const userService = new UserService()