import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MagnifyingGlassIcon, MapPinIcon, BriefcaseIcon, ClockIcon } from '@heroicons/react/24/outline'

const ViewJobs = () => {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  // --- 1. FETCH JOBS FROM PUBLIC API ---
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        // This endpoint requires NO authentication (Guest access)
        const response = await fetch('http://127.0.0.1:8000/jobs/public/')
        if (response.ok) {
          const data = await response.json()
          setJobs(data)
        }
      } catch (error) {
        console.error("Error fetching jobs:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [])

  // --- 2. CLIENT-SIDE SEARCH FILTER ---
  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    job.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="bg-gray-900 min-h-screen text-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* --- HEADER / SEARCH SECTION --- */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
            Find Your Next Dream Job
          </h1>
          <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
            Browse active job openings and let our AI match your resume to the perfect role.
          </p>
          
          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto">
            <MagnifyingGlassIcon className="absolute left-4 top-3.5 size-5 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search by title, skill, or location..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-full py-3 pl-12 pr-6 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-lg shadow-indigo-500/10 transition-all"
            />
          </div>
        </div>
    
        {/* --- JOB LIST --- */}
        {loading ? (
          <div className="text-center text-gray-500 py-20">Loading available jobs...</div>
        ) : (
          <div className="grid gap-6">
            {filteredJobs.length === 0 ? (
               <div className="text-center py-12 bg-gray-800/50 rounded-2xl border border-gray-700 border-dashed">
                 <p className="text-gray-400 text-lg">No jobs found matching "{searchTerm}"</p>
               </div>
            ) : (
              filteredJobs.map((job) => (
                <div key={job.id} className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-indigo-500/50 transition-all hover:shadow-lg group flex flex-col md:flex-row md:items-center justify-between gap-6">
                  
                  {/* Job Details */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between md:justify-start gap-4 mb-2">
                      <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                        {job.title}
                      </h3>
                      {job.is_active && (
                        <span className="bg-green-500/10 text-green-400 text-xs px-2 py-1 rounded-full border border-green-500/20">
                          Active
                        </span>
                      )}
                    </div>
                    
                    {/* Metadata Badges */}
                    <div className="flex flex-wrap gap-4 text-sm text-gray-400 mt-3">
                      <div className="flex items-center gap-1.5">
                        <BriefcaseIcon className="size-4" /> Full-time
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPinIcon className="size-4" /> {job.location}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <ClockIcon className="size-4" /> Posted {new Date(job.posted_at).toLocaleDateString()}
                      </div>
                    </div>
                    
                    {/* Short Description Preview */}
                    <p className="text-gray-500 text-sm mt-3 line-clamp-2">
                      {job.description}
                    </p>
                  </div>

                  {/* Apply Button */}
                  <div>
                    <Link 
                      to={`/jobs/${job.id}/apply`}
                      className="inline-flex items-center justify-center bg-white text-gray-900 px-6 py-2.5 rounded-lg font-semibold hover:bg-gray-100 transition-colors w-full md:w-auto shadow-md"
                    >
                      Apply Now &rarr;
                    </Link>
                  </div>

                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ViewJobs