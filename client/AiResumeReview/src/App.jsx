import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import RecruiterDashboard from './pages/RecruiterDashboard';
import Header from './components/Header';
import Hero from './pages/Hero';
import Features from './pages/Features';


// Simple placeholder for Home
const Home = () => <h2>Job Board Home (Candidate View)</h2>;

function App() {
  return (
    <Router>
      <Header />

      <Routes>
        <Route path="/" element={
          <>
            <Hero />
            <Features />
          </>
        } />
        <Route path="/dashboard" element={<RecruiterDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;