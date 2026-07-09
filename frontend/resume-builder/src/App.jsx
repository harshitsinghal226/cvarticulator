import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Home/Dashboard'
import EditResume from './pages/ResumeUpdate/EditResume'
import ResetPassword from './pages/Auth/ResetPassword'
import UserProvider from './context/userContext'
import ThemeProvider from './context/ThemeContext'


const App = () => {
  return (
    <ThemeProvider>
      <UserProvider>
        <Router>
          <Routes>
            {/* Default Route */}
            <Route path='/' element={<LandingPage />} />
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/resume/:resumeId' element={<EditResume />} />
            <Route path='/reset-password/:token' element={<ResetPassword />} />
          </Routes>

          <Toaster 
            toastOptions={{
              className: "",
              style: {
                fontSize: "13px",
              },
            }}
          />
        </Router>
      </UserProvider>
    </ThemeProvider>
  )
}

export default App;
