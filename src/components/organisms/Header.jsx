import React, { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { cn } from "@/utils/cn"
import { useUser } from "@/hooks/useUser"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"

const Header = ({ className, ...props }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { currentUser, logout, isAuthenticated, isJobSeeker, isEmployer, isAdmin } = useUser()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  const getDashboardPath = () => {
    if (isJobSeeker) return "/job-seeker-dashboard"
    if (isEmployer) return "/employer-dashboard"
    if (isAdmin) return "/admin-dashboard"
    return "/"
  }

  const getNavItems = () => {
    if (!isAuthenticated) return []
    
    const commonItems = [
      { path: getDashboardPath(), label: "Dashboard", icon: "Home" },
      { path: "/profile", label: "Profile", icon: "User" }
    ]

    if (isJobSeeker) {
      return [
        ...commonItems,
        { path: "/jobs", label: "Find Jobs", icon: "Briefcase" },
        { path: "/applications", label: "Applications", icon: "FileText" }
      ]
    }

    if (isEmployer) {
      return [
        ...commonItems,
        { path: "/applications", label: "Applications", icon: "FileText" }
      ]
    }

    if (isAdmin) {
      return [
        ...commonItems,
        { path: "/applications", label: "Manage System", icon: "Settings" }
      ]
    }

    return commonItems
  }

  const navItems = getNavItems()

  return (
    <header className={cn("bg-white shadow-md border-b border-gray-200", className)} {...props}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            onClick={() => navigate("/")} 
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <ApperIcon name="Briefcase" size={24} className="text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
              TalentBridge
            </span>
          </div>

          {/* Desktop Navigation */}
          {isAuthenticated && (
            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    location.pathname === item.path
                      ? "text-primary bg-primary/10"
                      : "text-gray-600 hover:text-primary hover:bg-primary/5"
                  )}
                >
                  <ApperIcon name={item.icon} size={16} />
                  {item.label}
                </button>
              ))}
            </nav>
          )}

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                    <ApperIcon name="User" size={16} className="text-white" />
                  </div>
                  <div className="text-sm">
<p className="font-medium text-gray-900">{currentUser.email_c || currentUser.email}</p>
                    <p className="text-gray-500 capitalize">{currentUser.role_c || currentUser.role}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <ApperIcon name="LogOut" size={16} className="mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <Button onClick={() => navigate("/")}>
                Get Started
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <ApperIcon 
              name={isMobileMenuOpen ? "X" : "Menu"} 
              size={24} 
              className="text-gray-600" 
            />
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && isAuthenticated && (
          <div className="md:hidden border-t border-gray-200 py-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path)
                  setIsMobileMenuOpen(false)
                }}
                className={cn(
"flex items-center gap-3 w-full px-3 py-3 rounded-md text-left transition-colors",
                  location.pathname === item.path
                    ? "text-primary bg-primary/10"
                    : "text-gray-600 hover:text-primary hover:bg-primary/5"
                )}
              >
                <ApperIcon name={item.icon} size={20} />
                {item.label}
              </button>
            ))}
            
            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className="flex items-center gap-3 px-3 py-2">
                <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                  <ApperIcon name="User" size={16} className="text-white" />
                </div>
                <div className="text-sm">
                  <p className="font-medium text-gray-900">{currentUser.email_c || currentUser.email}</p>
                  <p className="text-gray-500 capitalize">{currentUser.role_c || currentUser.role}</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="w-full mx-3 mt-2" 
                onClick={handleLogout}
              >
                <ApperIcon name="LogOut" size={16} className="mr-2" />
                Logout
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header