import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

function MyRequests() {
  const { user } = useAuth();

  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [viewingResponses, setViewingResponses] = useState(null);
  const [responses, setResponses] = useState([]);

  const fetchMyRequests = useCallback(() => {
    if (!user) return;

    axios
      .get(`http://localhost:5000/api/users/${user.id}/requests`)
      .then((res) => {
        setRequests(res.data);
      })
      .catch((err) => {
        console.error(err);
        setMessage('Unable to load your requests');
      });
  }, [user]);

  useEffect(() => {
    fetchMyRequests();
  }, [fetchMyRequests]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this request?')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/requests/${id}`);

      setMessage('Request cancelled successfully');
      fetchMyRequests();
    } catch (err) {
      setMessage('Error cancelling request');
    }
  };

  const startEdit = (req) => {
    setEditingId(req.id);

    setEditForm({
      blood_group: req.blood_group,
      units_needed: req.units_needed,
      hospital: req.hospital,
      urgency: req.urgency
    });

    setMessage('');
  };

  const handleEditChange = (e) => {
    setEditForm((previousForm) => ({
      ...previousForm,
      [e.target.name]: e.target.value
    }));
  };

  const submitEdit = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/requests/${id}`,
        editForm
      );

      setMessage('Request updated successfully');
      setEditingId(null);
      fetchMyRequests();
    } catch (err) {
      setMessage(
        'Error: ' +
          (err.response?.data?.message || 'Cannot edit this request')
      );
    }
  };

  const viewResponses = async (id) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/requests/${id}/responses`
      );

      setResponses(res.data);
      setViewingResponses(id);
    } catch (err) {
      console.error(err);
      setMessage('Unable to load donor responses');
    }
  };

  if (!user) {
    return (
      <main className="app-page">
        <div className="empty-state">
          <h3>Login required</h3>
          <p>Please log in to view your requests.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="app-page">
      <section className="page-heading">
        <div>
          <span className="page-eyebrow">REQUEST MANAGEMENT</span>

          <h1>My Blood Requests</h1>

          <p>
            Track and manage the blood requests you have posted.
          </p>
        </div>

        <div className="summary-box">
          <span>Total Requests</span>
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
          <h3>No blood requests</h3>
          <p>You have not posted any blood requests yet.</p>
        </div>
      ) : (
        <section className="request-list">
          {requests.map((req) => (
            <article className="request-card" key={req.id}>
              {editingId === req.id ? (
                <div className="edit-request-form">
                  <div className="edit-heading">
                    <h3>Edit Blood Request</h3>
                    <p>Update the details of your request.</p>
                  </div>

                  <div className="form-grid">
                    <div className="form-field">
                      <label htmlFor={`blood-${req.id}`}>
                        Blood Group
                      </label>

                      <select
                        id={`blood-${req.id}`}
                        name="blood_group"
                        value={editForm.blood_group}
                        onChange={handleEditChange}
                      >
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

                    <div className="form-field">
                      <label htmlFor={`units-${req.id}`}>
                        Units Needed
                      </label>

                      <input
                        id={`units-${req.id}`}
                        name="units_needed"
                        type="number"
                        min="1"
                        value={editForm.units_needed}
                        onChange={handleEditChange}
                      />
                    </div>
                  </div>

                  <div className="form-field">
                    <label htmlFor={`hospital-${req.id}`}>
                      Hospital
                    </label>

                    <input
                      id={`hospital-${req.id}`}
                      name="hospital"
                      value={editForm.hospital}
                      onChange={handleEditChange}
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor={`urgency-${req.id}`}>
                      Urgency
                    </label>

                    <select
                      id={`urgency-${req.id}`}
                      name="urgency"
                      value={editForm.urgency}
                      onChange={handleEditChange}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>

                  <div className="action-group">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => submitEdit(req.id)}
                    >
                      Save Changes
                    </button>

                    <button
                      type="button"
                      className="btn btn-light"
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
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
                      <span>Status</span>
                      <strong>{req.status}</strong>
                    </div>
                  </div>

                  <div className="action-group">
                    {req.status === 'pending' && (
                      <>
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => startEdit(req)}
                        >
                          Edit Request
                        </button>

                        <button
                          type="button"
                          className="btn btn-danger-outline"
                          onClick={() => handleDelete(req.id)}
                        >
                          Cancel Request
                        </button>
                      </>
                    )}

                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => viewResponses(req.id)}
                    >
                      View Donor Responses
                    </button>
                  </div>

                  {viewingResponses === req.id && (
                    <div className="responses-panel">
                      <div className="responses-header">
                        <h3>Donor Responses</h3>

                        <button
                          type="button"
                          className="close-responses"
                          onClick={() => setViewingResponses(null)}
                        >
                          Close
                        </button>
                      </div>

                      {responses.length === 0 ? (
                        <p>No donors have responded yet.</p>
                      ) : (
                        <div className="responses-list">
                          {responses.map((response) => (
                            <div
                              className="response-row"
                              key={response.id}
                            >
                              <div className="donor-information">
                                <strong>
                                  {response.donor_name}
                                </strong>

                                <span>{response.phone}</span>
                              </div>

                              <span
                                className={`status-badge status-${String(
                                  response.status
                                ).toLowerCase()}`}
                              >
                                {response.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

export default MyRequests;