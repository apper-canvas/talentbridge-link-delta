import React, { createContext, useContext, useState, useEffect } from "react"
import { useSelector, useDispatch } from 'react-redux'
import { setUser, clearUser } from '@/store/userSlice'

const UserContext = createContext(null)

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}

export const UserProvider = ({ children }) => {
const dispatch = useDispatch()
  const userState = useSelector((state) => state.user)
  const currentUser = userState?.user
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(false)

  const login = async (credentials) => {
    try {
      const { ApperUI } = window.ApperSDK
      await ApperUI.login(credentials)
      return currentUser
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }

  const logout = async () => {
    try {
      const { ApperUI } = window.ApperSDK
      await ApperUI.logout()
      dispatch(clearUser())
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const register = async (userData) => {
    try {
      const { ApperUI } = window.ApperSDK
      await ApperUI.register(userData)
      return currentUser
    } catch (error) {
      console.error("Registration error:", error)
      throw error
    }
  }

  const updateProfile = async (profileData) => {
    try {
      setLoading(true)
      // Profile update logic will be handled by individual services
      return profileData
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
    isAuthenticated: userState?.isAuthenticated || false,
    isJobSeeker: currentUser?.role_c === "jobSeeker",
    isEmployer: currentUser?.role_c === "employer", 
    isAdmin: currentUser?.role_c === "admin"
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}