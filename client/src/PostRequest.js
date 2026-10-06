import { useState } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

function PostRequest() {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    blood_group: '',
    units_needed: '',
    hospital: '',
    urgency: 'medium'
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData((previousForm) => ({
      ...previousForm,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        'http://localhost:5000/api/requests',
        {
          ...formData,
          user_id: user.id
        }
      );

      setMessage(res.data.message);

      setFormData({
        blood_group: '',
        units_needed: '',
        hospital: '',
        urgency: 'medium'
      });
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
          <p>Please log in to post a blood request.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="app-page">
      <section className="page-heading centered-heading">
        <div>
          <span className="page-eyebrow">NEED BLOOD</span>

          <h1>Post a Blood Request</h1>

          <p>
            Provide the details so suitable donors can respond.
          </p>
        </div>
      </section>

      <form className="form-card request-form" onSubmit={handleSubmit}>
        <div className="form-card-top">
          <div className="form-icon">+</div>

          <div>
            <h2>Request Details</h2>
            <p>
              Please provide accurate information about the blood
              requirement.
            </p>
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="blood_group">
            Blood Group Needed
          </label>

          <select
            id="blood_group"
            name="blood_group"
            value={formData.blood_group}
            onChange={handleChange}
            required
          >
            <option value="">Select Blood Group</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
          </select>
        </div>

        <div className="form-row">
          <div className="form-field">
            <label htmlFor="units_needed">
              Units Needed
            </label>

            <input
              id="units_needed"
              name="units_needed"
              type="number"
              min="1"
              max="20"
              placeholder="Example: 2"
              value={formData.units_needed}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="urgency">
              Urgency Level
            </label>

            <select
              id="urgency"
              name="urgency"
              value={formData.urgency}
              onChange={handleChange}
            >
              <option value="low">
                Low - within a few days
              </option>

              <option value="medium">
                Medium - within 24 hours
              </option>

              <option value="high">
                High - within a few hours
              </option>

              <option value="critical">
                Critical - immediate emergency
              </option>
            </select>
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="hospital">
            Hospital Name and Location
          </label>

          <input
            id="hospital"
            name="hospital"
            type="text"
            placeholder="Example: City Hospital, Kozhikode"
            value={formData.hospital}
            onChange={handleChange}
            required
          />
        </div>

        <div className="urgency-information">
          <strong>Important:</strong>
          <span>
            Make sure the hospital and urgency details are correct.
          </span>
        </div>

        <button className="form-submit" type="submit">
          Post Blood Request
        </button>

        {message && (
          <div className="feedback success">
            {message}
          </div>
        )}
      </form>
    </main>
  );
}

export default PostRequest;