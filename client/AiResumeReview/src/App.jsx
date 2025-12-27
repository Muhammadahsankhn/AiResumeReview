import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './pages/Hero';
import Features from './pages/Features';
import RecruiterDashboard from './pages/RecruiterDashboard';
import JobApplicants from './pages/JobApplicants';
import Login from './pages/Login';
import Register from './pages/Register';
import ViewJobs from './pages/ViewJobs';
import Apply from './pages/Apply';
import ProtectedRoute from './components/ProtectedRoute'; // <--- Import the Bouncer

function App() {
  return (
    <Router>
      <Header /> 
      <Routes>
        
        {/* --- PUBLIC ROUTES (Accessible by everyone) --- */}
        <Route path="/" element={<><Hero /><Features /></>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* --- RECRUITER ONLY ROUTES --- */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['recruiter']}>
              <RecruiterDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/jobs/:jobId/applicants" 
          element={
            <ProtectedRoute allowedRoles={['recruiter']}>
              <JobApplicants />
            </ProtectedRoute>
          } 
        />

        {/* --- CANDIDATE ONLY ROUTES --- */}
        <Route 
          path="/jobs" 
          element={
            <ProtectedRoute allowedRoles={['candidate']}>
              <ViewJobs />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/jobs/:jobId/apply" 
          element={
            <ProtectedRoute allowedRoles={['candidate']}>
              <Apply />
            </ProtectedRoute>
          } 
        />

      </Routes>
    </Router>
  );
}

export default App;