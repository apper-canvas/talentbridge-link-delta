import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import { UserProvider } from "@/hooks/useUser"
import Layout from "@/components/organisms/Layout"
import LandingPage from "@/components/pages/LandingPage"
import JobSeekerDashboard from "@/components/pages/JobSeekerDashboard"
import EmployerDashboard from "@/components/pages/EmployerDashboard"
import AdminDashboard from "@/components/pages/AdminDashboard"
import JobSearch from "@/components/pages/JobSearch"
import ProfilePage from "@/components/pages/ProfilePage"
import ApplicationsPage from "@/components/pages/ApplicationsPage"

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <div className="App">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/*" element={<Layout />}>
              <Route path="job-seeker-dashboard" element={<JobSeekerDashboard />} />
              <Route path="employer-dashboard" element={<EmployerDashboard />} />
              <Route path="admin-dashboard" element={<AdminDashboard />} />
              <Route path="jobs" element={<JobSearch />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="applications" element={<ApplicationsPage />} />
            </Route>
          </Routes>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            style={{ zIndex: 9999 }}
          />
        </div>
      </BrowserRouter>
    </UserProvider>
  )
}

export default App