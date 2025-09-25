import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { toast } from "react-toastify"
import { cn } from "@/utils/cn"
import { useUser } from "@/hooks/useUser"
import Button from "@/components/atoms/Button"
import Card from "@/components/atoms/Card"
import FormField from "@/components/molecules/FormField"
import Input from "@/components/atoms/Input"
import Select from "@/components/atoms/Select"
import ApperIcon from "@/components/ApperIcon"

const HeroSection = ({ className, ...props }) => {
  const navigate = useNavigate()
  const { login, register } = useUser()
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const [selectedRole, setSelectedRole] = useState("")
  
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  })
  
  const [registerData, setRegisterData] = useState({
    email: "",
    password: "",
    role: ""
  })

  const roleOptions = [
    { value: "jobSeeker", label: "Job Seeker" },
    { value: "employer", label: "Employer" },
    { value: "admin", label: "Administrator" }
  ]

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const user = await login(loginData)
      toast.success("Login successful!")
      
      // Navigate based on role
      if (user.role === "jobSeeker") {
        navigate("/job-seeker-dashboard")
      } else if (user.role === "employer") {
        navigate("/employer-dashboard")
      } else if (user.role === "admin") {
        navigate("/admin-dashboard")
      }
    } catch (error) {
      toast.error("Login failed. Please check your credentials.")
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    try {
      const user = await register(registerData)
      toast.success("Registration successful!")
      
      // Navigate based on role
      if (user.role === "jobSeeker") {
        navigate("/job-seeker-dashboard")
      } else if (user.role === "employer") {
        navigate("/employer-dashboard")
      } else if (user.role === "admin") {
        navigate("/admin-dashboard")
      }
    } catch (error) {
      toast.error("Registration failed. Please try again.")
    }
  }

  const handleGetStarted = (role) => {
    setSelectedRole(role)
    setShowRegister(true)
    setRegisterData(prev => ({ ...prev, role }))
  }

  return (
    <section className={cn("relative overflow-hidden bg-gradient-primary py-20 lg:py-32", className)} {...props}>
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-white"
          >
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Bridge the Gap Between
              <span className="block bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                Talent & Opportunity
              </span>
            </h1>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Connect with the perfect job or find exceptional candidates. Our platform streamlines the employment process for job seekers, employers, and administrators.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-gray-100 font-bold"
                onClick={() => setShowLogin(true)}
              >
                Sign In
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-primary font-bold"
                onClick={() => setShowRegister(true)}
              >
                Get Started Free
              </Button>
            </div>

            {/* Role Cards */}
            <div className="mt-12 grid sm:grid-cols-3 gap-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="glass-effect p-6 rounded-lg cursor-pointer"
                onClick={() => handleGetStarted("jobSeeker")}
              >
                <ApperIcon name="User" size={32} className="text-white mb-3" />
                <h3 className="font-bold text-lg mb-2">Job Seekers</h3>
                <p className="text-blue-100 text-sm">Find your dream job and advance your career</p>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="glass-effect p-6 rounded-lg cursor-pointer"
                onClick={() => handleGetStarted("employer")}
              >
                <ApperIcon name="Building2" size={32} className="text-white mb-3" />
                <h3 className="font-bold text-lg mb-2">Employers</h3>
                <p className="text-blue-100 text-sm">Discover top talent for your organization</p>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="glass-effect p-6 rounded-lg cursor-pointer"
                onClick={() => handleGetStarted("admin")}
              >
                <ApperIcon name="Shield" size={32} className="text-white mb-3" />
                <h3 className="font-bold text-lg mb-2">Administrators</h3>
                <p className="text-blue-100 text-sm">Manage and oversee the platform</p>
              </motion.div>
            </div>
          </motion.div>

          {/* Login/Register Forms */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            {showLogin && (
              <Card className="p-8">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
                  <p className="text-gray-600">Sign in to your account</p>
                </div>
                
                <form onSubmit={handleLogin} className="space-y-6">
                  <FormField label="Email Address" required>
                    <Input
                      type="email"
                      value={loginData.email}
                      onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter your email"
                      required
                    />
                  </FormField>
                  
                  <FormField label="Password" required>
                    <Input
                      type="password"
                      value={loginData.password}
                      onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="Enter your password"
                      required
                    />
                  </FormField>
                  
                  <div className="flex gap-3">
                    <Button type="submit" className="flex-1">
                      Sign In
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setShowLogin(false)
                        setShowRegister(true)
                      }}
                    >
                      Register
                    </Button>
                  </div>
                </form>
                
                <button
                  onClick={() => setShowLogin(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                  <ApperIcon name="X" size={20} />
                </button>
              </Card>
            )}

            {showRegister && (
              <Card className="p-8">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h2>
                  <p className="text-gray-600">Join TalentBridge today</p>
                </div>
                
                <form onSubmit={handleRegister} className="space-y-6">
                  <FormField label="Email Address" required>
                    <Input
                      type="email"
                      value={registerData.email}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter your email"
                      required
                    />
                  </FormField>
                  
                  <FormField label="Password" required>
                    <Input
                      type="password"
                      value={registerData.password}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="Create a password"
                      required
                    />
                  </FormField>
                  
                  <FormField label="I am a..." required>
                    <Select
                      options={roleOptions}
                      value={registerData.role}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, role: e.target.value }))}
                      placeholder="Select your role"
                      required
                    />
                  </FormField>
                  
                  <div className="flex gap-3">
                    <Button type="submit" className="flex-1">
                      Create Account
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setShowRegister(false)
                        setShowLogin(true)
                      }}
                    >
                      Sign In
                    </Button>
                  </div>
                </form>
                
                <button
                  onClick={() => setShowRegister(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                  <ApperIcon name="X" size={20} />
                </button>
              </Card>
            )}

            {!showLogin && !showRegister && (
              <div className="glass-effect p-8 rounded-lg text-center text-white">
                <ApperIcon name="Briefcase" size={64} className="mx-auto mb-6 opacity-80" />
                <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
                <p className="text-blue-100 mb-6">
                  Click on your role above or use the buttons to sign in or register
                </p>
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    className="flex-1 border-white text-white hover:bg-white hover:text-primary"
                    onClick={() => setShowLogin(true)}
                  >
                    Sign In
                  </Button>
                  <Button 
                    className="flex-1 bg-white text-primary hover:bg-gray-100"
                    onClick={() => setShowRegister(true)}
                  >
                    Register
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection