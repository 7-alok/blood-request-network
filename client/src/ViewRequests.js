import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

function ViewRequests() {
  const { user } = useAuth();

  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState('');

  const fetchRequests = useCallback(() => {
    axios
      .get('http://localhost:5000/api/requests')
      .then((res) => {
        setRequests(res.data);
      })
      .catch((err) => {
        console.error(err);
        setMessage('Unable to load blood requests');
      });
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleAccept = async (requestId) => {
    try {
      const res = await axios.post(
        'http://localhost:5000/api/responses',
        {
          request_id: requestId,
          donor_id: user.id
        }
      );

      setMessage(res.data.message);
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
          <p>Please log in to view blood requests.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="app-page">
      <section className="page-heading">
        <div>
          <span className="page-eyebrow">DONOR OPPORTUNITIES</span>

          <h1>Active Blood Requests</h1>

          <p>
            Find people who need your blood group and offer your support.
          </p>
        </div>

        <div className="summary-box">
          <span>Active Requests</span>
          <strong>{requests.length}</strong>
        </div>
      </section>

      {message && (
        <div className="feedback success">
          {message}
        </div>
      )}

      {requests.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">♥</div>
          <h3>No active requests</h3>
          <p>There are no active blood requests right now.</p>
        </div>
      ) : (
        <section className="request-list">
          {requests.map((req) => (
            <article className="request-card" key={req.id}>
              <div className="request-card-header">
                <div className="blood-group-badge">
                  {req.blood_group}
                </div>

                <span
                  className={`status-badge status-${String(
                    req.status
                  ).toLowerCase()}`}
                >
                  {req.status}
                </span>
              </div>

              <div className="request-details">
                <div className="detail-item">
                  <span>Units needed</span>
                  <strong>{req.units_needed}</strong>
                </div>

                <div className="detail-item">
                  <span>Hospital</span>
                  <strong>{req.hospital}</strong>
                </div>

                <div className="detail-item">
                  <span>Urgency</span>
                  <strong className={`urgency-${req.urgency}`}>
                    {req.urgency}
                  </strong>
                </div>

                <div className="detail-item">
                  <span>Requested by</span>
                  <strong>{req.requested_by}</strong>
                </div>
              </div>

              <div className="donation-card-footer">
                <div className="donation-message">
                  <span>Can you help?</span>
                  <strong>Your donation can save a life.</strong>
                </div>

                <button
                  type="button"
                  className="btn btn-primary accept-button"
                  onClick={() => handleAccept(req.id)}
                >
                  Accept &amp; Donate
                </button>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

export default ViewRequests;