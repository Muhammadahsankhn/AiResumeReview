import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './pages/Hero';
import Features from './pages/Features';
import RecruiterDashboard from './pages/RecruiterDashboard';
import Login from './pages/Login';       // <--- Import
import Register from './pages/Register'; // <--- Import

function App() {
  return (
    <Router>
      <Header /> 
      <Routes>
        <Route path="/" element={<><Hero /><Features /></>} />
        <Route path="/dashboard" element={<RecruiterDashboard />} />
        
        {/* --- AUTH ROUTES --- */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;