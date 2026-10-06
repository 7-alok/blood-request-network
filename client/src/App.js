import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import ProtectedRoute from './ProtectedRoute';
import Register from './Register';
import Login from './Login';
import PostRequest from './PostRequest';
import ViewRequests from './ViewRequests';
import AdminPanel from './AdminPanel';
import MyRequests from './MyRequests';
import Profile from './Profile';
import DonationHistory from './DonationHistory';
import AdminUsers from './AdminUsers';
import AdminStats from './AdminStats';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{ padding: '15px', background: '#eee', marginBottom: '20px' }}>
      <Link to="/" style={{ marginRight: '15px' }}>Register</Link>
      {!user && <Link to="/login" style={{ marginRight: '15px' }}>Login</Link>}
      {user && <Link to="/my-requests" style={{ marginRight: '15px' }}>My Requests</Link>}
      {user && <Link to="/post-request" style={{ marginRight: '15px' }}>Post Request</Link>}
      {user && <Link to="/requests" style={{ marginRight: '15px' }}>View Requests</Link>}
      {user && <Link to="/donation-history" style={{ marginRight: '15px' }}>Donation History</Link>}
      {user && <Link to="/profile" style={{ marginRight: '15px' }}>Profile</Link>}
      {user && user.role === 'admin' && <Link to="/admin" style={{ marginRight: '15px' }}>Admin Panel</Link>}
      {user && user.role === 'admin' && <Link to="/admin-users" style={{ marginRight: '15px' }}>Manage Users</Link>}
      {user && user.role === 'admin' && <Link to="/admin-stats" style={{ marginRight: '15px' }}>Statistics</Link>}
      {user && (
        <>
          <span style={{ marginRight: '15px' }}>Logged in as: {user.name} ({user.role})</span>
          <button onClick={handleLogout}>Logout</button>
        </>
      )}
    </nav>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/post-request" element={<ProtectedRoute><PostRequest /></ProtectedRoute>} />
          <Route path="/requests" element={<ProtectedRoute><ViewRequests /></ProtectedRoute>} />
          <Route path="/my-requests" element={<ProtectedRoute><MyRequests /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/donation-history" element={<ProtectedRoute><DonationHistory /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute adminOnly={true}><AdminPanel /></ProtectedRoute>} />
          <Route path="/admin-users" element={<ProtectedRoute adminOnly={true}><AdminUsers /></ProtectedRoute>} />
          <Route path="/admin-stats" element={<ProtectedRoute adminOnly={true}><AdminStats /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;