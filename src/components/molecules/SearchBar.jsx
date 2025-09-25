import React, { useState } from "react"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"
import Input from "@/components/atoms/Input"
import Button from "@/components/atoms/Button"

const SearchBar = ({ 
  placeholder = "Search...", 
  onSearch, 
  className,
  ...props 
}) => {
  const [searchTerm, setSearchTerm] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    if (onSearch) {
      onSearch(searchTerm)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn("relative flex gap-2", className)} {...props}>
      <div className="relative flex-1">
        <ApperIcon 
          name="Search" 
          size={20} 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
        />
        <Input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      <Button type="submit" className="shrink-0">
        Search
      </Button>
    </form>
  )
}

export default SearchBar