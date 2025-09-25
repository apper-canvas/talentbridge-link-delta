import React from "react"
import { cn } from "@/utils/cn"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import FormField from "@/components/molecules/FormField"
import Input from "@/components/atoms/Input"
import Select from "@/components/atoms/Select"
import ApperIcon from "@/components/ApperIcon"

const FilterSidebar = ({ 
  filters, 
  onFiltersChange, 
  onClear,
  className,
  ...props 
}) => {
  const jobTypes = [
    { value: "full-time", label: "Full Time" },
    { value: "part-time", label: "Part Time" },
    { value: "contract", label: "Contract" },
    { value: "freelance", label: "Freelance" },
    { value: "internship", label: "Internship" }
  ]

  const experienceLevels = [
    { value: "entry", label: "Entry Level" },
    { value: "mid", label: "Mid Level" },
    { value: "senior", label: "Senior Level" },
    { value: "executive", label: "Executive" }
  ]

  const industries = [
    { value: "technology", label: "Technology" },
    { value: "healthcare", label: "Healthcare" },
    { value: "finance", label: "Finance" },
    { value: "education", label: "Education" },
    { value: "manufacturing", label: "Manufacturing" },
    { value: "retail", label: "Retail" },
    { value: "consulting", label: "Consulting" },
    { value: "other", label: "Other" }
  ]

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value }
    if (onFiltersChange) {
      onFiltersChange(newFilters)
    }
  }

  return (
    <Card className={cn("sticky top-4", className)} {...props}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <ApperIcon name="Filter" size={20} />
          Filters
        </h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClear}
          className="text-gray-500 hover:text-gray-700"
        >
          Clear All
        </Button>
      </div>

      <div className="space-y-6">
        <FormField label="Location">
          <Input
            placeholder="Enter location"
            value={filters.location || ""}
            onChange={(e) => handleFilterChange("location", e.target.value)}
          />
        </FormField>

        <FormField label="Job Type">
          <Select
            options={jobTypes}
            value={filters.jobType || ""}
            onChange={(e) => handleFilterChange("jobType", e.target.value)}
            placeholder="Select job type"
          />
        </FormField>

        <FormField label="Experience Level">
          <Select
            options={experienceLevels}
            value={filters.experienceLevel || ""}
            onChange={(e) => handleFilterChange("experienceLevel", e.target.value)}
            placeholder="Select experience level"
          />
        </FormField>

        <FormField label="Industry">
          <Select
            options={industries}
            value={filters.industry || ""}
            onChange={(e) => handleFilterChange("industry", e.target.value)}
            placeholder="Select industry"
          />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Min Salary">
            <Input
              type="number"
              placeholder="0"
              value={filters.salaryMin || ""}
              onChange={(e) => handleFilterChange("salaryMin", e.target.value)}
            />
          </FormField>
          
          <FormField label="Max Salary">
            <Input
              type="number"
              placeholder="200000"
              value={filters.salaryMax || ""}
              onChange={(e) => handleFilterChange("salaryMax", e.target.value)}
            />
          </FormField>
        </div>
      </div>
    </Card>
  )
}

export default FilterSidebar