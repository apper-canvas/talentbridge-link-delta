import React, { createContext, useContext, useState, useEffect } from "react"
import { userService } from "@/services/api/userService"

const UserContext = createContext(null)

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(false)

  const login = async (credentials) => {
    try {
      setLoading(true)
      const user = await userService.login(credentials)
      setCurrentUser(user)
      
      // Load profile based on role
      if (user.role === "jobSeeker") {
        const profile = await userService.getJobSeekerProfile(user.Id)
        setUserProfile(profile)
      } else if (user.role === "employer") {
        const profile = await userService.getEmployerProfile(user.Id)
        setUserProfile(profile)
      }
      
      return user
    } catch (error) {
      console.error("Login error:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setCurrentUser(null)
    setUserProfile(null)
  }

  const register = async (userData) => {
    try {
      setLoading(true)
      const user = await userService.create(userData)
      setCurrentUser(user)
      return user
    } catch (error) {
      console.error("Registration error:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (profileData) => {
    try {
      setLoading(true)
      if (currentUser?.role === "jobSeeker") {
        const updated = await userService.updateJobSeekerProfile(currentUser.Id, profileData)
        setUserProfile(updated)
        return updated
      } else if (currentUser?.role === "employer") {
        const updated = await userService.updateEmployerProfile(currentUser.Id, profileData)
        setUserProfile(updated)
        return updated
      }
    } catch (error) {
      console.error("Profile update error:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const value = {
    currentUser,
    userProfile,
    loading,
    login,
    logout,
    register,
    updateProfile,
    isAuthenticated: !!currentUser,
    isJobSeeker: currentUser?.role === "jobSeeker",
    isEmployer: currentUser?.role === "employer",
    isAdmin: currentUser?.role === "admin"
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}