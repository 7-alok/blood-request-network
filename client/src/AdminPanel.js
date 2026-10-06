import { useState, useEffect } from 'react';
import axios from 'axios';

function AdminPanel() {
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = () => {
    axios
      .get('http://localhost:5000/api/admin/requests')
      .then((res) => setRequests(res.data))
      .catch((err) => console.error(err));
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/requests/${id}/status`,
        { status }
      );

      setMessage(res.data.message);
      fetchRequests();
    } catch (err) {
      setMessage(
        'Error: ' +
          (err.response?.data?.message || 'Something went wrong')
      );
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        'Permanently delete this request? This cannot be undone.'
      )
    ) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/requests/${id}`);
      setMessage('Request permanently deleted');
      fetchRequests();
    } catch (err) {
      setMessage('Error deleting request');
    }
  };

  return (
    <main className="app-page">
      <section className="page-heading">
        <div>
          <span className="page-eyebrow">ADMINISTRATION</span>
          <h1>Manage Blood Requests</h1>
          <p>Review, verify, and manage all blood requests.</p>
        </div>

        <div className="summary-box">
          <span>Total Requests</span>
          <strong>{requests.length}</strong>
        </div>
      </section>

      {message && <div className="feedback success">{message}</div>}

      {requests.length === 0 ? (
        <div className="empty-state">
          <h3>No requests found</h3>
          <p>There are currently no blood requests to manage.</p>
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
                  <span>Hospital</span>
                  <strong>{req.hospital}</strong>
                </div>

                <div className="detail-item">
                  <span>Requested by</span>
                  <strong>{req.requested_by}</strong>
                </div>

                <div className="detail-item">
                  <span>Current status</span>
                  <strong>{req.status}</strong>
                </div>
              </div>

              <div className="action-group">
                <button
                  className="btn btn-primary"
                  onClick={() => updateStatus(req.id, 'verified')}
                >
                  Verify
                </button>

                <button
                  className="btn btn-secondary"
                  onClick={() => updateStatus(req.id, 'broadcasted')}
                >
                  Broadcast
                </button>

                <button
                  className="btn btn-success"
                  onClick={() => updateStatus(req.id, 'fulfilled')}
                >
                  Mark Fulfilled
                </button>

                <button
                  className="btn btn-warning"
                  onClick={() => updateStatus(req.id, 'cancelled')}
                >
                  Cancel Request
                </button>

                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(req.id)}
                >
                  Delete Permanently
                </button>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

export default AdminPanel;