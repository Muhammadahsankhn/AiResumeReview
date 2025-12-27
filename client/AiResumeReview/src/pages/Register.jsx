import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { UserIcon, BriefcaseIcon, PhotoIcon } from '@heroicons/react/24/outline'

export default function Register() {
  const [role, setRole] = useState('candidate')
  const navigate = useNavigate()

  // State for form inputs
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [avatar, setAvatar] = useState(null) // <--- NEW STATE FOR IMAGE

  const handleRegister = async (e) => {
    e.preventDefault()

    // 1. Create FormData object (Required for sending files)
    const formData = new FormData()
    formData.append('username', username)
    formData.append('email', email)
    formData.append('password', password)
    formData.append('role', role) 
    
    if (avatar) {
      formData.append('profile_image', avatar) // 'profile_image' must match Django model field
    }
    console.log("--- SENDING REGISTRATION DATA ---")
    for (var pair of formData.entries()) {
        console.log(pair[0]+ ', ' + pair[1]); 
    }
    try {
      const response = await fetch('http://127.0.0.1:8000/api/register/', {
        method: 'POST',
        // Note: Do NOT set 'Content-Type': 'application/json' manually.
        // The browser sets the correct boundary for FormData automatically.
        body: formData, 
      })

      if (response.ok) {
        alert("Registration Successful! Please Login.")
        navigate('/login')
      } else {
        const data = await response.json()
        alert("Error: " + JSON.stringify(data))
      }
    } catch (error) {
      console.error("Registration failed:", error)
      alert("Registration failed. Is the Django server running?")
    }
  }

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-gray-900 h-screen text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">
          Create your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        
        {/* --- ROLE SELECTION TOGGLE --- */}
        <div className="flex p-1 bg-gray-800 rounded-xl mb-6 relative">
          <motion.div 
            className="absolute bg-indigo-600 rounded-lg h-[calc(100%-8px)] top-1"
            initial={false}
            animate={{ 
              width: "50%", 
              x: role === 'candidate' ? 0 : "100%" 
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />

          <button
            type="button"
            onClick={() => setRole('candidate')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium z-10 transition-colors ${role === 'candidate' ? 'text-white' : 'text-gray-400'}`}
          >
            <UserIcon className="size-5" /> Candidate
          </button>
          
          <button
            type="button"
            onClick={() => setRole('recruiter')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium z-10 transition-colors ${role === 'recruiter' ? 'text-white' : 'text-gray-400'}`}
          >
            <BriefcaseIcon className="size-5" /> Recruiter
          </button>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          
          {/* --- USERNAME --- */}
          <div>
            <label className="block text-sm/6 font-medium text-white">Full Name</label>
            <div className="mt-2">
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm/6"
              />
            </div>
          </div>

          {/* --- EMAIL --- */}
          <div>
            <label className="block text-sm/6 font-medium text-white">Email address</label>
            <div className="mt-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm/6"
              />
            </div>
          </div>

           {/* --- PROFILE PICTURE UPLOAD --- */}
           <div>
            <label className="block text-sm/6 font-medium text-white">Profile Picture <span className="text-gray-500 text-xs">(Optional)</span></label>
            <div className="mt-2 flex items-center gap-x-3">
              <PhotoIcon className="size-12 text-gray-500" aria-hidden="true" />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setAvatar(e.target.files[0])} // Store the file object
                className="block w-full text-sm text-gray-400
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-indigo-600 file:text-white
                  file:cursor-pointer hover:file:bg-indigo-500
                "
              />
            </div>
          </div>

          {/* --- PASSWORD --- */}
          <div>
            <label className="block text-sm/6 font-medium text-white">Password</label>
            <div className="mt-2">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              Sign up as {role === 'candidate' ? 'Job Seeker' : 'Recruiter'}
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm/6 text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-indigo-400 hover:text-indigo-300">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}