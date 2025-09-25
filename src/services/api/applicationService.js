class ApplicationService {
  constructor() {
    this.tableName = 'application_c'
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
          {"field": {"Name": "job_title_c"}},
          {"field": {"Name": "company_name_c"}},
          {"field": {"Name": "location_c"}},
          {"field": {"Name": "cover_letter_c"}},
          {"field": {"Name": "applied_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "employer_notes_c"}},
          {"field": {"Name": "job_id_c"}},
          {"field": {"Name": "job_seeker_id_c"}}
        ],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      }
      
      const apperClient = this.getApperClient()
      const response = await apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        return []
      }
      
      return response.data || []
    } catch (error) {
      console.error("Error fetching applications:", error?.response?.data?.message || error)
      return []
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "job_title_c"}},
          {"field": {"Name": "company_name_c"}},
          {"field": {"Name": "location_c"}},
          {"field": {"Name": "cover_letter_c"}},
          {"field": {"Name": "applied_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "employer_notes_c"}},
          {"field": {"Name": "job_id_c"}},
          {"field": {"Name": "job_seeker_id_c"}}
        ]
      }
      
      const apperClient = this.getApperClient()
      const response = await apperClient.getRecordById(this.tableName, id, params)
      
      if (!response?.data) {
        return null
      }
      
      return response.data
    } catch (error) {
      console.error(`Error fetching application ${id}:`, error?.response?.data?.message || error)
      return null
    }
  }

  async create(applicationData) {
    try {
      const params = {
        records: [{
          Name: applicationData.job_title_c || applicationData.Name,
          job_title_c: applicationData.job_title_c,
          company_name_c: applicationData.company_name_c,
          location_c: applicationData.location_c,
          cover_letter_c: applicationData.cover_letter_c,
          applied_date_c: applicationData.applied_date_c,
          status_c: applicationData.status_c || "applied",
          employer_notes_c: applicationData.employer_notes_c,
          job_id_c: parseInt(applicationData.job_id_c),
          job_seeker_id_c: parseInt(applicationData.job_seeker_id_c)
        }]
      }
      
      const apperClient = this.getApperClient()
      const response = await apperClient.createRecord(this.tableName, params)
      
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
      console.error("Error creating application:", error?.response?.data?.message || error)
      return null
    }
  }

  async update(id, applicationData) {
    try {
      const params = {
        records: [{
          Id: id,
          Name: applicationData.job_title_c || applicationData.Name,
          job_title_c: applicationData.job_title_c,
          company_name_c: applicationData.company_name_c,
          location_c: applicationData.location_c,
          cover_letter_c: applicationData.cover_letter_c,
          applied_date_c: applicationData.applied_date_c,
          status_c: applicationData.status_c,
          employer_notes_c: applicationData.employer_notes_c,
          job_id_c: applicationData.job_id_c ? parseInt(applicationData.job_id_c) : undefined,
          job_seeker_id_c: applicationData.job_seeker_id_c ? parseInt(applicationData.job_seeker_id_c) : undefined
        }]
      }
      
      const apperClient = this.getApperClient()
      const response = await apperClient.updateRecord(this.tableName, params)
      
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
      console.error("Error updating application:", error?.response?.data?.message || error)
      return null
    }
  }

  async delete(id) {
    try {
      const params = { 
        RecordIds: [id] 
      }
      
      const apperClient = this.getApperClient()
      const response = await apperClient.deleteRecord(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        return false
      }
      
      return true
    } catch (error) {
      console.error("Error deleting application:", error?.response?.data?.message || error)
      return false
    }
  }

  async getByJobSeeker(jobSeekerId) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "job_title_c"}},
          {"field": {"Name": "company_name_c"}},
          {"field": {"Name": "location_c"}},
          {"field": {"Name": "cover_letter_c"}},
          {"field": {"Name": "applied_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "employer_notes_c"}},
          {"field": {"Name": "job_id_c"}},
          {"field": {"Name": "job_seeker_id_c"}}
        ],
        where: [{"FieldName": "job_seeker_id_c", "Operator": "ExactMatch", "Values": [parseInt(jobSeekerId)]}],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}]
      }
      
      const apperClient = this.getApperClient()
      const response = await apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        return []
      }
      
      return response.data || []
    } catch (error) {
      console.error("Error fetching job seeker applications:", error?.response?.data?.message || error)
      return []
    }
  }

  async getByJob(jobId) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "job_title_c"}},
          {"field": {"Name": "company_name_c"}},
          {"field": {"Name": "location_c"}},
          {"field": {"Name": "cover_letter_c"}},
          {"field": {"Name": "applied_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "employer_notes_c"}},
          {"field": {"Name": "job_id_c"}},
          {"field": {"Name": "job_seeker_id_c"}}
        ],
        where: [{"FieldName": "job_id_c", "Operator": "ExactMatch", "Values": [parseInt(jobId)]}],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}]
      }
      
      const apperClient = this.getApperClient()
      const response = await apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        return []
      }
      
      return response.data || []
    } catch (error) {
      console.error("Error fetching job applications:", error?.response?.data?.message || error)
      return []
    }
  }

  async getByStatus(status) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "job_title_c"}},
          {"field": {"Name": "company_name_c"}},
          {"field": {"Name": "location_c"}},
          {"field": {"Name": "cover_letter_c"}},
          {"field": {"Name": "applied_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "employer_notes_c"}},
          {"field": {"Name": "job_id_c"}},
          {"field": {"Name": "job_seeker_id_c"}}
        ],
        where: [{"FieldName": "status_c", "Operator": "ExactMatch", "Values": [status]}],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}]
      }
      
      const apperClient = this.getApperClient()
      const response = await apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        return []
      }
      
      return response.data || []
    } catch (error) {
      console.error("Error fetching applications by status:", error?.response?.data?.message || error)
      return []
    }
  }
}

export const applicationService = new ApplicationService()