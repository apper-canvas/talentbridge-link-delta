import React from "react"
import { motion } from "framer-motion"
import HeroSection from "@/components/organisms/HeroSection"
import ApperIcon from "@/components/ApperIcon"

const LandingPage = () => {
  const features = [
    {
      icon: "Search",
      title: "Smart Job Matching",
      description: "Advanced algorithms connect the right candidates with the perfect opportunities"
    },
    {
      icon: "Users",
      title: "Comprehensive Profiles",
      description: "Detailed profiles help employers find candidates that match their culture and requirements"
    },
    {
      icon: "BarChart3",
      title: "Analytics Dashboard",
      description: "Track applications, hiring metrics, and optimize your recruitment strategy"
    },
    {
      icon: "Shield",
      title: "Secure Platform",
      description: "Enterprise-grade security ensures your data and privacy are always protected"
    }
  ]

  const stats = [
    { value: "10,000+", label: "Active Job Seekers" },
    { value: "500+", label: "Trusted Employers" },
    { value: "95%", label: "Success Rate" },
    { value: "24/7", label: "Support Available" }
  ]

  return (
    <div className="min-h-screen">
      <HeroSection />
      
      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl font-bold text-gray-900 mb-4"
            >
              Why Choose TalentBridge?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              Our platform brings together cutting-edge technology and human expertise to create meaningful employment connections
            </motion.p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="w-16 h-16 bg-gradient-primary rounded-xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <ApperIcon name={feature.icon} size={28} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-white mb-6"
          >
            Ready to Find Your Perfect Match?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-blue-100 mb-8"
          >
            Join thousands of professionals who have already found success through TalentBridge
          </motion.p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <ApperIcon name="Briefcase" size={24} className="text-white" />
              </div>
              <span className="text-2xl font-bold text-white">TalentBridge</span>
            </div>
            
            <div className="text-gray-400 text-center md:text-right">
              <p>&copy; 2024 TalentBridge. All rights reserved.</p>
              <div className="flex gap-6 mt-2 justify-center md:justify-end">
                <span className="hover:text-white cursor-pointer">Privacy Policy</span>
                <span className="hover:text-white cursor-pointer">Terms of Service</span>
                <span className="hover:text-white cursor-pointer">Support</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage