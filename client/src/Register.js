import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import logo from './assets/logo.png';
import heroImage from './assets/register-hero.png';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'user',
    location: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/register', formData);
      setMessage(res.data.message);
      setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="login-page">
      {/* Left side — illustration */}
      <div className="login-left">
        <div className="login-left-inner">
          <h1 className="login-tagline">
            Join Our <span>Life-Saving</span><br />
            Community
          </h1>
          <p className="login-subtext">Register as a requester, donor, or admin and be part of every second that matters.</p>

          <img src={heroImage} alt="Blood donation registration illustration" className="login-illustration" />

         </div>
         </div>
      {/* Right side — register form */}
      <div className="login-right">
        <div className="login-card">
          <img src={logo} alt="Blood Donation Network logo" className="login-logo-img" />
          <h2 className="login-brand">Blood Donation<span>Network</span></h2>

          <h3 className="login-welcome">Create your account</h3>
          <p className="login-caption">Sign up to request, donate, or manage the network</p>

          {message && <p className="login-error">{message}</p>}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <svg className="input-icon" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="4" stroke="#999" strokeWidth="1.6"/>
                <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="#999" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
              <input name="name" placeholder="Full Name" onChange={handleChange} required />
            </div>

            <div className="input-group">
              <svg className="input-icon" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="5" width="18" height="14" rx="2" stroke="#999" strokeWidth="1.6"/>
                <path d="M3 7l9 6 9-6" stroke="#999" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <input name="email" type="email" placeholder="Email address" onChange={handleChange} required />
            </div>

            <div className="input-group">
              <svg className="input-icon" viewBox="0 0 24 24" fill="none">
                <rect x="5" y="11" width="14" height="9" rx="2" stroke="#999" strokeWidth="1.6"/>
                <path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="#999" strokeWidth="1.6"/>
              </svg>
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                onChange={handleChange}
                required
              />
              <span className="input-toggle" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
                    <path d="M3 3l18 18" stroke="#999" strokeWidth="1.6" strokeLinecap="round"/>
                    <path d="M10.6 6.2A10.6 10.6 0 0 1 12 6c5 0 9 4 10 6-.4.8-1.4 2.3-2.9 3.6M6.6 6.6C4.5 8 3 9.9 2 12c1 2 5 6 10 6 1.1 0 2.1-.2 3-.5" stroke="#999" strokeWidth="1.6" strokeLinecap="round"/>
                    <path d="M9.9 10a3 3 0 0 0 4.2 4.2" stroke="#999" strokeWidth="1.6" strokeLinecap="round"/>
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
                    <path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6-10-6-10-6z" stroke="#999" strokeWidth="1.6" strokeLinejoin="round"/>
                    <circle cx="12" cy="12" r="3" stroke="#999" strokeWidth="1.6"/>
                  </svg>
                )}
              </span>
            </div>

            <div className="input-group">
              <svg className="input-icon" viewBox="0 0 24 24" fill="none">
                <path d="M4 5c0-1.1.9-2 2-2h1.2c.5 0 1 .3 1.2.8l1 2.5c.2.5.1 1-.3 1.4L7.8 9c1 2.2 2.9 4.1 5.1 5.1l1.3-1.3c.4-.4.9-.5 1.4-.3l2.5 1c.5.2.8.7.8 1.2V16c0 1.1-.9 2-2 2h-1C9.6 18 4 12.4 4 6V5z" stroke="#999" strokeWidth="1.6" strokeLinejoin="round"/>
              </svg>
              <input name="phone" placeholder="Phone Number" onChange={handleChange} />
            </div>

            <div className="input-group">
              <svg className="input-icon" viewBox="0 0 24 24" fill="none">
                <path d="M12 21s-7-5.1-7-11a7 7 0 0 1 14 0c0 5.9-7 11-7 11z" stroke="#999" strokeWidth="1.6" strokeLinejoin="round"/>
                <circle cx="12" cy="10" r="2.4" stroke="#999" strokeWidth="1.6"/>
              </svg>
              <input name="location" placeholder="Location / City" onChange={handleChange} />
            </div>

            <div className="input-group select-group">
              <svg className="input-icon" viewBox="0 0 24 24" fill="none">
                 <circle cx="12" cy="8" r="4" stroke="#999" strokeWidth="1.6"/>
                <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="#999" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
              <select name="role" onChange={handleChange} defaultValue="user">
                <option value="user">Register as: Requester (User)</option>
                <option value="donor">Register as: Donor</option>
                <option value="admin">Register as: Admin</option>
              </select>
            </div>

            <button type="submit" className="login-btn" style={{ marginTop: '6px' }}>Create Account</button>
          </form>

          <p className="login-signup">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;