import { useState } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import logo from './assets/logo.png';
import heroImage from './assets/image.png';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        'http://localhost:5000/api/login',
        formData
      );

      login(res.data.user);
      navigate('/requests');

    } catch (err) {
      setMessage(
        err.response?.data?.message || 'Something went wrong'
      );
    }
  };

  return (
    <div className="login-page">

      {/* LEFT SIDE - BLOOD DONATION IMAGE */}
      <div className="login-left">

        <img
          src={heroImage}
          alt="Blood donation illustration"
          className="login-illustration"
        />

      </div>


      {/* RIGHT SIDE - LOGIN FORM */}
      <div className="login-right">

        <div className="login-card">

          {/* Logo */}
          <img
            src={logo}
            alt="Blood Donation Network logo"
            className="login-logo-img"
          />

          {/* Brand */}
          <h2 className="login-brand">
            Blood Donation<span>Network</span>
          </h2>

          {/* Welcome */}
          <h3 className="login-welcome">
            Welcome back
          </h3>

          <p className="login-caption">
            Login to continue your lifesaving journey
          </p>

          {/* Error message */}
          {message && (
            <p className="login-error">
              {message}
            </p>
          )}

          <form onSubmit={handleSubmit}>

            {/* EMAIL */}
            <div className="input-group">

              <svg
                className="input-icon"
                viewBox="0 0 24 24"
                fill="none"
              >
                <rect
                  x="3"
                  y="5"
                  width="18"
                  height="14"
                  rx="2"
                  stroke="#999"
                  strokeWidth="1.6"
                />

                <path
                  d="M3 7l9 6 9-6"
                  stroke="#999"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <input
                name="email"
                type="email"
                placeholder="Email address"
                onChange={handleChange}
                required
              />

            </div>


            {/* PASSWORD */}
            <div className="input-group">

              <svg
                className="input-icon"
                viewBox="0 0 24 24"
                fill="none"
              >
                <rect
                  x="5"
                  y="11"
                  width="14"
                  height="9"
                  rx="2"
                  stroke="#999"
                  strokeWidth="1.6"
                />

                <path
                  d="M8 11V8a4 4 0 0 1 8 0v3"
                  stroke="#999"
                  strokeWidth="1.6"
                />
              </svg>

              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                onChange={handleChange}
                required
              />

              {/* PASSWORD TOGGLE */}
              <span
                className="input-toggle"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >

                {showPassword ? (

                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    width="18"
                    height="18"
                  >
                    <path
                      d="M3 3l18 18"
                      stroke="#999"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />

                    <path
                      d="M10.6 6.2A10.6 10.6 0 0 1 12 6c5 0 9 4 10 6-.4.8-1.4 2.3-2.9 3.6M6.6 6.6C4.5 8 3 9.9 2 12c1 2 5 6 10 6 1.1 0 2.1-.2 3-.5"
                      stroke="#999"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />

                    <path
                      d="M9.9 10a3 3 0 0 0 4.2 4.2"
                      stroke="#999"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </svg>

                ) : (

                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    width="18"
                    height="18"
                  >
                    <path
                      d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6-10-6-10-6z"
                      stroke="#999"
                      strokeWidth="1.6"
                      strokeLinejoin="round"
                    />

                    <circle
                      cx="12"
                      cy="12"
                      r="3"
                      stroke="#999"
                      strokeWidth="1.6"
                    />
                  </svg>

                )}

              </span>

            </div>


            {/* REMEMBER ME */}
            <div className="login-row">

              <label className="remember-me">

                <input type="checkbox" />

                <span>
                  Remember me
                </span>

              </label>

            </div>


            {/* LOGIN BUTTON */}
            <button
              type="submit"
              className="login-btn"
            >
              Login
            </button>

          </form>


          {/* SIGN UP */}
          <p className="login-signup">

            Don't have an account?

            {' '}

            <Link to="/">
              Sign up
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;