import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeftIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline'

const JobApplicants = () => {
  const { jobId } = useParams() // Get the Job ID from the URL
  const [applicants, setApplicants] = useState([])
  const [loading, setLoading] = useState(true)
  const [jobTitle, setJobTitle] = useState("Loading...")

  // --- FETCH APPLICANTS FROM API ---
  useEffect(() => {
    fetchApplicants()
  }, [jobId])

  const fetchApplicants = async () => {
    const token = localStorage.getItem('access_token')
    try {
      const response = await fetch(`http://127.0.0.1:8000/jobs/${jobId}/applicants/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setApplicants(data)
        
        // Optional: If data exists, grab job title from the first record to display
        if (data.length > 0) {
             // In a real app you might want a separate fetch for job details to get title properly
             // But for now let's assume the serializer sends basic job info or we fetch it separately
             // For simplicity, let's just title the page generic or fetch job detail if needed.
             setJobTitle("Job #" + jobId) 
        }
      }
    } catch (error) {
      console.error("Error fetching applicants:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gray-900 min-h-screen p-8 text-white pt-24">
      <div className="max-w-7xl mx-auto">
        
        {/* --- HEADER --- */}
        <div className="flex justify-between items-center mb-8">
          <div>
             <Link to="/dashboard" className="text-gray-400 hover:text-white flex items-center gap-2 mb-2">
                <ArrowLeftIcon className="size-4" /> Back to Dashboard
             </Link>
            <h1 className="text-3xl font-bold">Candidate Applications</h1>
            <p className="text-gray-400 mt-2">Viewing applicants for Job ID: <span className="text-indigo-400">{jobId}</span></p>
          </div>
        </div>

        {/* --- APPLICANTS TABLE --- */}
        <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-700">
          {loading ? (
             <div className="p-8 text-center text-gray-500">Loading AI Analysis...</div>
          ) : (
            <table className="w-full text-left">
                <thead className="bg-gray-700/50 text-gray-300 uppercase text-xs tracking-wider">
                <tr>
                    <th className="p-4">Applied At</th>
                    <th className="p-4">AI Match Score</th>
                    <th className="p-4">AI Summary</th>
                    <th className="p-4 text-right">Resume</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                {applicants.map((app) => (
                    <tr key={app.id} className="hover:bg-gray-700/30 transition-colors">
                    <td className="p-4 text-gray-400">
                        {new Date(app.applied_at).toLocaleDateString()}
                    </td>
                    
                    {/* Score Badge */}
                    <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-bold 
                        ${app.ai_score >= 80 ? 'bg-green-500/20 text-green-400 border border-green-500/50' : 
                            app.ai_score >= 50 ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50' : 
                            'bg-red-500/20 text-red-400 border border-red-500/50'}`}>
                        {app.ai_score}% Match
                        </span>
                    </td>
                    
                    <td className="p-4 text-gray-300 text-sm max-w-lg">
                        {app.ai_summary || "Processing..."}
                    </td>
                    
                    <td className="p-4 text-right">
                        <a 
                            href={app.resume} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 text-sm font-medium"
                        >
                            <DocumentArrowDownIcon className="size-5" /> View PDF
                        </a>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
          )}
          
          {!loading && applicants.length === 0 && (
            <div className="p-12 text-center text-gray-500 border-t border-gray-700">
              <p className="text-lg">No one has applied to this job yet.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default JobApplicants