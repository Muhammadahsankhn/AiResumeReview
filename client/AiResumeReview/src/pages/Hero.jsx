import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const Hero = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState(null) // 'candidate' or 'recruiter'

  useEffect(() => {
    // 1. Check for token
    const token = localStorage.getItem('access_token')
    // 2. Check for role (You must save this during login!)
    const role = localStorage.getItem('user_role') 
    
    if (token) {
      setIsAuthenticated(true)
      setUserRole(role) 
    }
  }, [])

  // --- CONTENT CONFIGURATION BASED ON ROLE ---
  let content = {
    title: (
      <>
        Let AI Find Your <br /> 
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
          Perfect Career Match
        </span>
      </>
    ),
    description: "Stop guessing. Our AI analyzes your resume and matches you with jobs based on your actual skills, not just keywords.",
    primaryBtnText: "Get Started Free",
    primaryBtnLink: "/register",
    secondaryBtnText: "Learn More",
    secondaryBtnLink: "#features"
  }

  // OVERRIDE CONTENT FOR CANDIDATES
  if (isAuthenticated && userRole === 'candidate') {
    content = {
      title: (
        <>
          Ready to Apply? <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
            Find Your Dream Job
          </span>
        </>
      ),
      description: "We have found 12 new jobs that match your Python and React skills. Upload your resume to apply instantly.",
      primaryBtnText: "Browse Jobs",
      primaryBtnLink: "/jobs", // You will build this page later
      secondaryBtnText: "Update Resume",
      secondaryBtnLink: "/profile"
    }
  }

  // OVERRIDE CONTENT FOR RECRUITERS
  if (isAuthenticated && userRole === 'recruiter') {
    content = {
      title: (
        <>
          Hire the Best. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            Let AI Sort Your Talent
          </span>
        </>
      ),
      description: "You have 50+ new applicants. Don't read every PDF—let our AI rank them by relevance instantly.",
      primaryBtnText: "Go to Dashboard",
      primaryBtnLink: "/dashboard",
      secondaryBtnText: "Post New Job",
      secondaryBtnLink: "/post-job"
    }
  }

  return (
    <div className="relative isolate px-6 pt-14 lg:px-8 bg-gray-900 text-white h-screen flex items-center overflow-hidden">
      
      {/* BACKGROUND ANIMATION */}
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1], 
          rotate: [0, 5, -5, 0],
          opacity: [0.3, 0.5, 0.3] 
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
      >
        <div
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
        />
      </motion.div>

      <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
        <div className="text-center">
          
          {/* DYNAMIC TITLE */}
          <motion.h1 
            key={userRole} // Re-animates when role changes
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="text-5xl font-semibold tracking-tight text-white sm:text-7xl"
          >
            {content.title}
          </motion.h1>
          
          {/* DYNAMIC DESCRIPTION */}
          <motion.p 
            key={userRole + "desc"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="mt-8 text-lg font-medium text-gray-400 sm:text-xl/8"
          >
            {content.description}
          </motion.p>
          
          {/* DYNAMIC BUTTONS */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-10 flex items-center justify-center gap-x-6"
          >
            <Link to={content.primaryBtnLink}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`rounded-md px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 
                  ${userRole === 'candidate' ? 'bg-emerald-600 hover:bg-emerald-500' : 
                    userRole === 'recruiter' ? 'bg-purple-600 hover:bg-purple-500' : 
                    'bg-indigo-600 hover:bg-indigo-500'}`}
              >
                {content.primaryBtnText}
              </motion.button>
            </Link>

            <Link to={content.secondaryBtnLink} className="text-sm/6 font-semibold text-white">
              {content.secondaryBtnText} <span aria-hidden="true">→</span>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Hero