import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

function Profile() {
  const { user, login } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: '',
    availability: 'available',
    last_donation_date: ''
  });

  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        location: user.location || '',
        availability: user.availability || 'available',
        last_donation_date: user.last_donation_date || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.put(
        `http://localhost:5000/api/users/${user.id}`,
        formData
      );

      setMessage(res.data.message);
      login({ ...user, ...formData });
    } catch (err) {
      setMessage(
        'Error: ' +
          (err.response?.data?.message || 'Something went wrong')
      );
    }
  };

  if (!user) {
    return (
      <main className="app-page">
        <div className="empty-state">
          <h3>Login required</h3>
          <p>Please log in to view your profile.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="app-page">
      <section className="page-heading centered-heading">
        <div>
          <span className="page-eyebrow">ACCOUNT SETTINGS</span>
          <h1>My Profile</h1>
          <p>Keep your contact and donor information updated.</p>
        </div>
      </section>

      <form className="form-card" onSubmit={handleSubmit}>
        <div className="profile-avatar">
          {formData.name?.charAt(0).toUpperCase() || 'U'}
        </div>

        <div className="form-field">
          <label>Full Name</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-field">
          <label>Phone</label>
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        <div className="form-field">
          <label>Location</label>
          <input
            name="location"
            value={formData.location}
            onChange={handleChange}
          />
        </div>

        {user.role === 'donor' && (
          <>
            <div className="form-field">
              <label>Availability</label>
              <select
                name="availability"
                value={formData.availability}
                onChange={handleChange}
              >
                <option value="available">Available</option>
                <option value="unavailable">Not Available</option>
              </select>
            </div>

            <div className="form-field">
              <label>Last Donation Date</label>
              <input
                name="last_donation_date"
                type="date"
                value={formData.last_donation_date}
                onChange={handleChange}
              />
            </div>
          </>
        )}

        <button className="form-submit" type="submit">
          Update Profile
        </button>

        {message && <div className="feedback success">{message}</div>}
      </form>
    </main>
  );
}

export default Profile;