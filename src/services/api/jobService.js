class JobService {
  constructor() {
    this.tableName = 'job_c'
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
          {"field": {"Name": "company_name_c"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "requirements_c"}},
          {"field": {"Name": "location_c"}},
          {"field": {"Name": "salary_min_c"}},
          {"field": {"Name": "salary_max_c"}},
          {"field": {"Name": "job_type_c"}},
          {"field": {"Name": "experience_level_c"}},
          {"field": {"Name": "posted_date_c"}},
          {"field": {"Name": "deadline_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "employer_id_c"}}
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
      console.error("Error fetching jobs:", error?.response?.data?.message || error)
      return []
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "company_name_c"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "requirements_c"}},
          {"field": {"Name": "location_c"}},
          {"field": {"Name": "salary_min_c"}},
          {"field": {"Name": "salary_max_c"}},
          {"field": {"Name": "job_type_c"}},
          {"field": {"Name": "experience_level_c"}},
          {"field": {"Name": "posted_date_c"}},
          {"field": {"Name": "deadline_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "employer_id_c"}}
        ]
      }
      
      const apperClient = this.getApperClient()
      const response = await apperClient.getRecordById(this.tableName, id, params)
      
      if (!response?.data) {
        return null
      }
      
      return response.data
    } catch (error) {
      console.error(`Error fetching job ${id}:`, error?.response?.data?.message || error)
      return null
    }
  }

  async create(jobData) {
    try {
      const params = {
        records: [{
          Name: jobData.title_c || jobData.Name,
          company_name_c: jobData.company_name_c,
          title_c: jobData.title_c,
          description_c: jobData.description_c,
          requirements_c: jobData.requirements_c,
          location_c: jobData.location_c,
          salary_min_c: jobData.salary_min_c,
          salary_max_c: jobData.salary_max_c,
          job_type_c: jobData.job_type_c,
          experience_level_c: jobData.experience_level_c,
          posted_date_c: jobData.posted_date_c,
          deadline_c: jobData.deadline_c,
          status_c: jobData.status_c || "active",
          employer_id_c: parseInt(jobData.employer_id_c)
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
      console.error("Error creating job:", error?.response?.data?.message || error)
      return null
    }
  }

  async update(id, jobData) {
    try {
      const params = {
        records: [{
          Id: id,
          Name: jobData.title_c || jobData.Name,
          company_name_c: jobData.company_name_c,
          title_c: jobData.title_c,
          description_c: jobData.description_c,
          requirements_c: jobData.requirements_c,
          location_c: jobData.location_c,
          salary_min_c: jobData.salary_min_c,
          salary_max_c: jobData.salary_max_c,
          job_type_c: jobData.job_type_c,
          experience_level_c: jobData.experience_level_c,
          posted_date_c: jobData.posted_date_c,
          deadline_c: jobData.deadline_c,
          status_c: jobData.status_c,
          employer_id_c: jobData.employer_id_c ? parseInt(jobData.employer_id_c) : undefined
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
      console.error("Error updating job:", error?.response?.data?.message || error)
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
      console.error("Error deleting job:", error?.response?.data?.message || error)
      return false
    }
  }

  async getByEmployer(employerId) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "company_name_c"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "requirements_c"}},
          {"field": {"Name": "location_c"}},
          {"field": {"Name": "salary_min_c"}},
          {"field": {"Name": "salary_max_c"}},
          {"field": {"Name": "job_type_c"}},
          {"field": {"Name": "experience_level_c"}},
          {"field": {"Name": "posted_date_c"}},
          {"field": {"Name": "deadline_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "employer_id_c"}}
        ],
        where: [{"FieldName": "employer_id_c", "Operator": "ExactMatch", "Values": [parseInt(employerId)]}],
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
      console.error("Error fetching employer jobs:", error?.response?.data?.message || error)
      return []
    }
  }

  async searchJobs(filters) {
    try {
      const whereConditions = []
      
      if (filters.title) {
        whereConditions.push({"FieldName": "title_c", "Operator": "Contains", "Values": [filters.title]})
      }
      
      if (filters.location) {
        whereConditions.push({"FieldName": "location_c", "Operator": "Contains", "Values": [filters.location]})
      }
      
      if (filters.jobType) {
        whereConditions.push({"FieldName": "job_type_c", "Operator": "ExactMatch", "Values": [filters.jobType]})
      }
      
      if (filters.experienceLevel) {
        whereConditions.push({"FieldName": "experience_level_c", "Operator": "ExactMatch", "Values": [filters.experienceLevel]})
      }
      
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "company_name_c"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "requirements_c"}},
          {"field": {"Name": "location_c"}},
          {"field": {"Name": "salary_min_c"}},
          {"field": {"Name": "salary_max_c"}},
          {"field": {"Name": "job_type_c"}},
          {"field": {"Name": "experience_level_c"}},
          {"field": {"Name": "posted_date_c"}},
          {"field": {"Name": "deadline_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "employer_id_c"}}
        ],
        where: whereConditions,
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
      console.error("Error searching jobs:", error?.response?.data?.message || error)
      return []
    }
  }
}

export const jobService = new JobService()