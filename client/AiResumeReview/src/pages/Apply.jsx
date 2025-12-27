import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { CloudArrowUpIcon, CheckCircleIcon, DocumentTextIcon } from '@heroicons/react/24/outline'

const Apply = () => {
  const { jobId } = useParams() // Get the job ID from the URL
  const navigate = useNavigate()
  
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [jobTitle, setJobTitle] = useState("Loading...")

  // --- 1. FETCH JOB DETAILS (To show the title) ---
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        // We reuse the public API to get the job title
        const response = await fetch('http://127.0.0.1:8000/jobs/public/')
        if (response.ok) {
          const data = await response.json()
          const currentJob = data.find(j => j.id === parseInt(jobId))
          if (currentJob) setJobTitle(currentJob.title)
        }
      } catch (error) {
        console.error("Error fetching job details:", error)
      }
    }
    fetchJobDetails()
  }, [jobId])

  // --- 2. HANDLE FILE UPLOAD & API CALL ---
  const handleApply = async (e) => {
    e.preventDefault()
    if (!file) return alert("Please upload a resume")

    setLoading(true)
    const token = localStorage.getItem('access_token')

    // Prepare the form data (Must use FormData for files)
    const formData = new FormData()
    formData.append('resume', file) // 'resume' must match the key in Django's serializer

    try {
      const response = await fetch(`http://127.0.0.1:8000/jobs/${jobId}/apply/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}` 
          // Note: DO NOT set 'Content-Type'. The browser sets it automatically for FormData.
        },
        body: formData
      })

      if (response.ok) {
        // Success!
        alert("Application Sent Successfully! Our AI is reviewing your resume now.")
        navigate('/jobs') // Redirect back to job list
      } else {
        // Error (e.g., duplicate application)
        const errorData = await response.json()
        alert("Application failed: " + JSON.stringify(errorData))
      }
    } catch (error) {
      console.error("Error applying:", error)
      alert("Something went wrong. Is the server running?")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 pt-24 text-white">
      
      {/* --- HEADER --- */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">
          Apply for <span className="text-indigo-400">{jobTitle}</span>
        </h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          Upload your resume (PDF) and let our AI match you to this role.
        </p>
      </div>

      {/* --- UPLOAD FORM --- */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-gray-800 py-8 px-4 shadow-xl sm:rounded-xl sm:px-10 border border-gray-700">
          <form className="space-y-6" onSubmit={handleApply}>
            
            {/* File Drop Area */}
            <div>
              <label className="block text-sm font-medium text-gray-300">Resume / CV (PDF Only)</label>
              <div className={`mt-2 flex justify-center rounded-lg border border-dashed px-6 py-10 transition-colors ${file ? 'border-green-500/50 bg-green-500/10' : 'border-gray-600 hover:bg-gray-700/50'}`}>
                <div className="text-center">
                  
                  {file ? (
                    // State: File Selected
                    <div className="flex flex-col items-center text-green-400 animate-fade-in-up">
                        <CheckCircleIcon className="mx-auto h-12 w-12" />
                        <p className="mt-2 text-sm text-white font-medium">{file.name}</p>
                        <p className="text-xs text-green-500">Ready to upload</p>
                        <button 
                            type="button" 
                            onClick={() => setFile(null)} 
                            className="text-xs text-red-400 mt-4 hover:text-red-300 underline"
                        >
                            Remove file
                        </button>
                    </div>
                  ) : (
                    // State: No File
                    <>
                        <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" aria-hidden="true" />
                        <div className="mt-4 flex text-sm leading-6 text-gray-400 justify-center">
                            <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer rounded-md font-semibold text-indigo-400 focus-within:outline-none hover:text-indigo-300"
                            >
                            <span>Upload a file</span>
                            <input 
                                id="file-upload" 
                                name="file-upload" 
                                type="file" 
                                accept=".pdf"
                                className="sr-only" 
                                onChange={(e) => setFile(e.target.files[0])}
                            />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs leading-5 text-gray-500">PDF up to 10MB</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading || !file}
                className={`flex w-full justify-center items-center gap-2 rounded-lg px-3 py-3 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 transition-all
                    ${loading 
                        ? 'bg-indigo-400 cursor-not-allowed opacity-75' 
                        : 'bg-indigo-600 hover:bg-indigo-500 hover:shadow-indigo-500/25'}`}
              >
                {loading ? (
                    <>Processing...</>
                ) : (
                    <>
                        <DocumentTextIcon className="size-5" />
                        Submit Application
                    </>
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  )
}

export default Apply