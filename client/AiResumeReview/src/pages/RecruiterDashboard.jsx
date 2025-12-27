import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { PlusIcon, TrashIcon, UsersIcon, MapPinIcon, CalendarIcon } from '@heroicons/react/24/outline'

const RecruiterDashboard = () => {
  const [jobs, setJobs] = useState([]) // Start empty
  const [loading, setLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  
  // Form State
  const [newJob, setNewJob] = useState({ title: '', location: '', description: '', requirements: '' })

  // --- 1. FETCH JOBS ON LOAD ---
  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    const token = localStorage.getItem('access_token')
    try {
      const response = await fetch('http://127.0.0.1:8000/jobs/my-jobs/', {
        headers: {
          'Authorization': `Bearer ${token}` // <--- THIS TELLS DJANGO WHO YOU ARE
        }
      })
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

  // --- 2. ADD JOB (Connect to API) ---
  const handleAddJob = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('access_token')

    try {
      const response = await fetch('http://127.0.0.1:8000/jobs/my-jobs/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newJob)
      })

      if (response.ok) {
        const savedJob = await response.json()
        setJobs([savedJob, ...jobs]) // Add to UI instantly
        setNewJob({ title: '', location: '', description: '', requirements: '' }) 
        setIsFormOpen(false)
      } else {
        alert("Failed to post job")
      }
    } catch (error) {
      console.error("Error posting job:", error)
    }
  }

  // --- 3. DELETE JOB (Optional: Connect to API) ---
  // --- 3. DELETE JOB (Connected to API) ---
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;

    const token = localStorage.getItem('access_token')

    try {
      const response = await fetch(`http://127.0.0.1:8000/jobs/my-jobs/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        // Remove from UI only if Backend delete was successful
        setJobs(jobs.filter(job => job.id !== id))
      } else {
        alert("Failed to delete job. You might not have permission.")
      }
    } catch (error) {
      console.error("Error deleting job:", error)
    }
  }

  if (loading) return <div className="text-white text-center pt-32">Loading your jobs...</div>

  return (
    <div className="bg-gray-900 min-h-screen p-8 text-white pt-24">
      <div className="max-w-7xl mx-auto">
        
        {/* --- HEADER --- */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold">Recruiter Dashboard</h1>
            <p className="text-gray-400 mt-2">Manage your job postings.</p>
          </div>
          <button 
            onClick={() => setIsFormOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2 transition-all shadow-lg shadow-indigo-500/30"
          >
            <PlusIcon className="size-5" /> Post New Job
          </button>
        </div>

        {/* --- ADD JOB MODAL --- */}
        {isFormOpen && (
          <div className="mb-8 bg-gray-800 p-6 rounded-xl border border-gray-700 animate-fade-in-down">
            <h3 className="text-xl font-semibold mb-4">Create New Job Listing</h3>
            <form onSubmit={handleAddJob} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm text-gray-400 mb-1">Job Title</label>
                    <input 
                    type="text" 
                    required
                    value={newJob.title}
                    onChange={(e) => setNewJob({...newJob, title: e.target.value})}
                    className="w-full bg-gray-700 border-gray-600 rounded-lg text-white px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm text-gray-400 mb-1">Location</label>
                    <input 
                    type="text" 
                    required
                    value={newJob.location}
                    onChange={(e) => setNewJob({...newJob, location: e.target.value})}
                    className="w-full bg-gray-700 border-gray-600 rounded-lg text-white px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm text-gray-400 mb-1">Description</label>
                    <textarea name="" id=""
                    type="text" 
                    required
                    value={newJob.description}
                    onChange={(e) => setNewJob({...newJob, description: e.target.value})}
                    className="w-full bg-gray-700 border-gray-600 rounded-lg text-white px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none">
                    </textarea>
                </div>

                <div>
                    <label className="block text-sm text-gray-400 mb-1">Requirements</label>
                    <textarea name="" id=""
                    type="text" 
                    required
                    value={newJob.requirements}
                    onChange={(e) => setNewJob({...newJob, requirements: e.target.value})}
                    className="w-full bg-gray-700 border-gray-600 rounded-lg text-white px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none">
                    </textarea>
                </div>

              </div>
              
              {/* Add description fields if needed */}

              <div className="flex gap-2 pt-2">
                <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg font-medium">Save Job</button>
                <button type="button" onClick={() => setIsFormOpen(false)} className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg font-medium">Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* --- JOBS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.length === 0 ? (
             <p className="text-gray-500 col-span-3 text-center py-10">You haven't posted any jobs yet.</p>
          ) : (
            jobs.map((job) => (
                <div key={job.id} className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-indigo-500/50 transition-all hover:shadow-xl hover:shadow-indigo-500/10 group">
                
                <div className="flex justify-between items-start mb-4">
                    <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">{job.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                        <MapPinIcon className="size-4" /> {job.location}
                    </div>
                    </div>
                    <button onClick={() => handleDelete(job.id)} className="text-gray-500 hover:text-red-400 p-1">
                    <TrashIcon className="size-5" />
                    </button>
                </div>

                <div className="flex items-center gap-6 mb-6 py-4 border-y border-gray-700/50">
                    <div className="flex items-center gap-2">
                    <UsersIcon className="size-5 text-indigo-400" />
                    <span className="font-semibold text-white">{job.applicant_count}</span>
                    <span className="text-gray-400 text-sm">Applicants</span>
                    </div>
                    <div className="flex items-center gap-2">
                    <CalendarIcon className="size-5 text-gray-500" />
                    <span className="text-gray-400 text-sm">
                        {new Date(job.posted_at).toLocaleDateString()}
                    </span>
                    </div>
                </div>

                <Link 
                    to={`/jobs/${job.id}/applicants`} 
                    className="block w-full text-center bg-gray-700 hover:bg-indigo-600 text-white py-2 rounded-lg font-medium transition-colors"
                >
                    View Applicants & AI Sort &rarr;
                </Link>

                </div>
            ))
          )}
        </div>

      </div>
    </div>
  )
}

export default RecruiterDashboard