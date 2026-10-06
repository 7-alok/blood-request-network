import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

function DonationHistory() {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (user) {
      axios
        .get(`http://localhost:5000/api/users/${user.id}/responses`)
        .then((res) => setHistory(res.data))
        .catch((err) => console.error(err));
    }
  }, [user]);

  if (!user) {
    return (
      <main className="app-page">
        <div className="empty-state">
          <h3>Login required</h3>
          <p>Please log in to view your donation history.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="app-page">
      <section className="page-heading">
        <div>
          <span className="page-eyebrow">DONOR ACTIVITY</span>
          <h1>My Donation History</h1>
          <p>Review your previous blood donation responses.</p>
        </div>

        <div className="summary-box">
          <span>Total Donations</span>
          <strong>{history.length}</strong>
        </div>
      </section>

      {history.length === 0 ? (
        <div className="empty-state">
          <h3>No donation history</h3>
          <p>You have not responded to any blood requests yet.</p>
        </div>
      ) : (
        <section className="history-list">
          {history.map((h) => (
            <article className="history-card" key={h.id}>
              <div className="history-card-header">
                <div className="blood-group-badge">
                  {h.blood_group}
                </div>

                <span
                  className={`status-badge status-${String(
                    h.status
                  ).toLowerCase()}`}
                >
                  {h.status}
                </span>
              </div>

              <div className="history-details">
                <div className="detail-item">
                  <span>Hospital</span>
                  <strong>{h.hospital}</strong>
                </div>

                <div className="detail-item">
                  <span>Units</span>
                  <strong>{h.units_needed}</strong>
                </div>

                <div className="detail-item">
                  <span>Your response</span>
                  <strong>{h.status}</strong>
                </div>

                <div className="detail-item">
                  <span>Date</span>
                  <strong>
                    {new Date(h.responded_at).toLocaleDateString()}
                  </strong>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

export default DonationHistory;