import React, { useState } from 'react'

// --- MOCK DATA (We will replace this with Django API later) ---
const INITIAL_APPLICANTS = [
  { id: 101, name: "Ali Khan", role: "Python Developer", score: 85, summary: "Strong Python skills, lacks React exp." },
  { id: 102, name: "Sarah Ahmed", role: "Frontend Engineer", score: 92, summary: "Perfect match. Excellent React & Tailwind." },
  { id: 103, name: "John Doe", role: "Full Stack", score: 45, summary: "Resume does not match job description." },
  { id: 104, name: "Ayesha Malik", role: "Data Scientist", score: 78, summary: "Good stats background, learning Python." },
];

const RecruiterDashboard = () => {
  const [applicants, setApplicants] = useState(INITIAL_APPLICANTS);
  const [isSorted, setIsSorted] = useState(false);

  // The Magic "AI Sort" Function
  const handleSort = () => {
    const sortedList = [...applicants].sort((a, b) => b.score - a.score);
    setApplicants(sortedList);
    setIsSorted(true);
  };

  const handleReset = () => {
    setApplicants(INITIAL_APPLICANTS);
    setIsSorted(false);
  };

  return (
    <div className="bg-gray-900 min-h-screen p-8 text-white pt-24"> 
      {/* pt-24 pushes content down so it doesn't hide behind the fixed Header */}
      
      <div className="max-w-7xl mx-auto">
        
        {/* Dashboard Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Candidate Applications</h1>
            <p className="text-gray-400 mt-2">Managing candidates for: <span className="text-indigo-400">Software Engineer</span></p>
          </div>
          
          <div className="space-x-4">
            {isSorted && (
              <button 
                onClick={handleReset}
                className="px-4 py-2 text-sm text-gray-400 hover:text-white transition"
              >
                Reset View
              </button>
            )}
            <button
              onClick={handleSort}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-lg font-semibold shadow-lg shadow-indigo-500/30 flex items-center gap-2 transition-all"
            >
              ✨ AI Sort Candidates
            </button>
          </div>
        </div>

        {/* Candidates Table */}
        <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-700">
          <table className="w-full text-left">
            <thead className="bg-gray-700/50 text-gray-300 uppercase text-xs tracking-wider">
              <tr>
                <th className="p-4">Candidate Name</th>
                <th className="p-4">Role Applied</th>
                <th className="p-4">AI Match Score</th>
                <th className="p-4">AI Summary</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {applicants.map((app) => (
                <tr key={app.id} className="hover:bg-gray-700/30 transition-colors">
                  <td className="p-4 font-medium text-white">{app.name}</td>
                  <td className="p-4 text-gray-400">{app.role}</td>
                  
                  {/* Score Badge with Conditional Colors */}
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-bold 
                      ${app.score >= 80 ? 'bg-green-500/20 text-green-400 border border-green-500/50' : 
                        app.score >= 50 ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50' : 
                        'bg-red-500/20 text-red-400 border border-red-500/50'}`}>
                      {app.score}% Match
                    </span>
                  </td>
                  
                  <td className="p-4 text-gray-400 text-sm max-w-md truncate">
                    {app.summary}
                  </td>
                  
                  <td className="p-4 text-right">
                    <button className="text-indigo-400 hover:text-indigo-300 text-sm font-medium">
                      View Resume &rarr;
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {applicants.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No applicants found.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default RecruiterDashboard