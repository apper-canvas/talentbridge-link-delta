import React, { useState, useEffect } from "react"
import { toast } from "react-toastify"
import { useUser } from "@/hooks/useUser"
import Button from "@/components/atoms/Button"
import Card from "@/components/atoms/Card"
import FormField from "@/components/molecules/FormField"
import Input from "@/components/atoms/Input"
import Select from "@/components/atoms/Select"
import Textarea from "@/components/atoms/Textarea"
import ApperIcon from "@/components/ApperIcon"
import Loading from "@/components/ui/Loading"

const ProfilePage = () => {
  const { currentUser, userProfile, updateProfile, isJobSeeker, isEmployer, loading } = useUser()
  const [formData, setFormData] = useState({})
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (userProfile) {
      setFormData(userProfile)
    } else if (currentUser) {
      // Initialize empty form based on user role
      if (isJobSeeker) {
        setFormData({
          firstName: "",
          lastName: "",
          phone: "",
          location: "",
          skills: [],
          experience: "",
          education: "",
          resumeUrl: "",
          profileComplete: false
        })
      } else if (isEmployer) {
        setFormData({
          companyName: "",
          industry: "",
          companySize: "",
          website: "",
          description: "",
          logoUrl: "",
          verificationStatus: "pending"
        })
      }
    }
  }, [userProfile, currentUser, isJobSeeker, isEmployer])

  const industryOptions = [
    { value: "technology", label: "Technology" },
    { value: "healthcare", label: "Healthcare" },
    { value: "finance", label: "Finance" },
    { value: "education", label: "Education" },
    { value: "manufacturing", label: "Manufacturing" },
    { value: "retail", label: "Retail" },
    { value: "consulting", label: "Consulting" },
    { value: "other", label: "Other" }
  ]

  const companySizeOptions = [
    { value: "1-10", label: "1-10 employees" },
    { value: "11-50", label: "11-50 employees" },
    { value: "51-200", label: "51-200 employees" },
    { value: "201-500", label: "201-500 employees" },
    { value: "501-1000", label: "501-1000 employees" },
    { value: "1000+", label: "1000+ employees" }
  ]

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSkillsChange = (skillsText) => {
    const skillsArray = skillsText.split(",").map(skill => skill.trim()).filter(skill => skill)
    setFormData(prev => ({ ...prev, skills: skillsArray }))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      setIsSaving(true)
      
      await updateProfile(formData)
      toast.success("Profile updated successfully!")
    } catch (err) {
      console.error("Profile update error:", err)
      toast.error("Failed to update profile")
    } finally {
      setIsSaving(false)
    }
  }

  const handleFileUpload = (field) => {
    // Simulate file upload
    const fileName = field === "resumeUrl" ? "resume.pdf" : "company-logo.png"
    const fileUrl = `/uploads/${fileName}`
    handleInputChange(field, fileUrl)
    toast.success(`${field === "resumeUrl" ? "Resume" : "Logo"} uploaded successfully!`)
  }

  if (loading) return <Loading message="Loading your profile..." />

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          {isJobSeeker ? "Job Seeker Profile" : isEmployer ? "Company Profile" : "Profile"}
        </h1>
        <p className="text-gray-600 mt-2">
          {isJobSeeker 
            ? "Complete your profile to get better job recommendations and increase your visibility to employers"
            : "Complete your company profile to attract top talent and build trust with candidates"
          }
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Job Seeker Profile Form */}
        {isJobSeeker && (
          <>
            <Card>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <ApperIcon name="User" size={24} />
                Personal Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="First Name" required>
                  <Input
                    value={formData.firstName || ""}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    placeholder="Enter your first name"
                    required
                  />
                </FormField>
                
                <FormField label="Last Name" required>
                  <Input
                    value={formData.lastName || ""}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    placeholder="Enter your last name"
                    required
                  />
                </FormField>
                
                <FormField label="Phone Number">
                  <Input
                    type="tel"
                    value={formData.phone || ""}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="(555) 123-4567"
                  />
                </FormField>
                
                <FormField label="Location">
                  <Input
                    value={formData.location || ""}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    placeholder="City, State"
                  />
                </FormField>
              </div>
            </Card>

            <Card>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <ApperIcon name="Briefcase" size={24} />
                Professional Information
              </h2>
              
              <div className="space-y-6">
                <FormField label="Skills" required>
                  <Input
                    value={formData.skills ? formData.skills.join(", ") : ""}
                    onChange={(e) => handleSkillsChange(e.target.value)}
                    placeholder="React, JavaScript, Python (comma-separated)"
                  />
                  <p className="text-sm text-gray-600 mt-1">Separate skills with commas</p>
                </FormField>
                
                <FormField label="Experience" required>
                  <Textarea
                    value={formData.experience || ""}
                    onChange={(e) => handleInputChange("experience", e.target.value)}
                    placeholder="Describe your work experience, achievements, and key projects..."
                    rows={4}
                  />
                </FormField>
                
                <FormField label="Education">
                  <Textarea
                    value={formData.education || ""}
                    onChange={(e) => handleInputChange("education", e.target.value)}
                    placeholder="List your educational background, degrees, certifications..."
                    rows={3}
                  />
                </FormField>
              </div>
            </Card>

            <Card>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <ApperIcon name="FileText" size={24} />
                Resume
              </h2>
              
              <FormField label="Resume">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  {formData.resumeUrl ? (
                    <div className="flex items-center justify-center gap-3">
                      <ApperIcon name="FileText" size={24} className="text-success" />
                      <span className="text-success font-medium">Resume uploaded</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleFileUpload("resumeUrl")}
                      >
                        Replace
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <ApperIcon name="Upload" size={32} className="mx-auto text-gray-400 mb-3" />
                      <p className="text-gray-600 mb-3">Upload your resume (PDF, DOC, DOCX)</p>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleFileUpload("resumeUrl")}
                      >
                        Choose File
                      </Button>
                    </div>
                  )}
                </div>
              </FormField>
            </Card>
          </>
        )}

        {/* Employer Profile Form */}
        {isEmployer && (
          <>
            <Card>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <ApperIcon name="Building2" size={24} />
                Company Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="Company Name" required>
                  <Input
                    value={formData.companyName || ""}
                    onChange={(e) => handleInputChange("companyName", e.target.value)}
                    placeholder="Enter your company name"
                    required
                  />
                </FormField>
                
                <FormField label="Industry" required>
                  <Select
                    options={industryOptions}
                    value={formData.industry || ""}
                    onChange={(e) => handleInputChange("industry", e.target.value)}
                    placeholder="Select your industry"
                    required
                  />
                </FormField>
                
                <FormField label="Company Size">
                  <Select
                    options={companySizeOptions}
                    value={formData.companySize || ""}
                    onChange={(e) => handleInputChange("companySize", e.target.value)}
                    placeholder="Select company size"
                  />
                </FormField>
                
                <FormField label="Website">
                  <Input
                    type="url"
                    value={formData.website || ""}
                    onChange={(e) => handleInputChange("website", e.target.value)}
                    placeholder="https://www.yourcompany.com"
                  />
                </FormField>
              </div>
              
              <FormField label="Company Description" required>
                <Textarea
                  value={formData.description || ""}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Describe your company, culture, mission, and what makes it a great place to work..."
                  rows={4}
                  required
                />
              </FormField>
            </Card>

            <Card>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <ApperIcon name="Image" size={24} />
                Company Logo
              </h2>
              
              <FormField label="Logo">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  {formData.logoUrl ? (
                    <div className="flex items-center justify-center gap-3">
                      <ApperIcon name="Image" size={24} className="text-success" />
                      <span className="text-success font-medium">Logo uploaded</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleFileUpload("logoUrl")}
                      >
                        Replace
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <ApperIcon name="Upload" size={32} className="mx-auto text-gray-400 mb-3" />
                      <p className="text-gray-600 mb-3">Upload your company logo (PNG, JPG, SVG)</p>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleFileUpload("logoUrl")}
                      >
                        Choose File
                      </Button>
                    </div>
                  )}
                </div>
              </FormField>
            </Card>
          </>
        )}

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            size="lg"
            disabled={isSaving}
            className="min-w-[150px]"
          >
            {isSaving ? (
              <>
                <ApperIcon name="Loader" size={16} className="mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <ApperIcon name="Save" size={16} className="mr-2" />
                Save Profile
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default ProfilePage