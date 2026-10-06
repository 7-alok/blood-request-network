import { useState, useEffect } from 'react';
import axios from 'axios';

function AdminStats() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/stats')
      .then((res) => {
        setStats(res.data);
      })
      .catch((err) => {
        console.error(err);
        setError('Unable to load statistics');
      });
  }, []);

  if (error) {
    return (
      <main className="app-page">
        <div className="empty-state error-state">
          <h3>Statistics unavailable</h3>
          <p>{error}</p>
        </div>
      </main>
    );
  }

  if (!stats) {
    return (
      <main className="app-page">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading statistics...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="app-page">
      <section className="page-heading">
        <div>
          <span className="page-eyebrow">ADMINISTRATION</span>

          <h1>Statistics Dashboard</h1>

          <p>
            Monitor blood requests, donations, and registered members.
          </p>
        </div>
      </section>

      <section className="stats-grid">
        <article className="stat-card stat-card-red">
          <div className="stat-card-icon">+</div>

          <div className="stat-card-content">
            <span>Total Requests</span>
            <strong>{stats.total_requests}</strong>
            <small>All submitted requests</small>
          </div>
        </article>

        <article className="stat-card stat-card-orange">
          <div className="stat-card-icon">!</div>

          <div className="stat-card-content">
            <span>Pending Requests</span>
            <strong>{stats.pending_requests}</strong>
            <small>Awaiting action</small>
          </div>
        </article>

        <article className="stat-card stat-card-green">
          <div className="stat-card-icon">✓</div>

          <div className="stat-card-content">
            <span>Fulfilled Requests</span>
            <strong>{stats.fulfilled_requests}</strong>
            <small>Successfully completed</small>
          </div>
        </article>

        <article className="stat-card stat-card-purple">
          <div className="stat-card-icon">D</div>

          <div className="stat-card-content">
            <span>Registered Donors</span>
            <strong>{stats.total_donors}</strong>
            <small>Available donor accounts</small>
          </div>
        </article>

        <article className="stat-card stat-card-blue">
          <div className="stat-card-icon">U</div>

          <div className="stat-card-content">
            <span>Registered Users</span>
            <strong>{stats.total_users}</strong>
            <small>Total user accounts</small>
          </div>
        </article>
      </section>

      <section className="stats-summary-card">
        <div>
          <span className="page-eyebrow">NETWORK OVERVIEW</span>
          <h2>Blood Donation Network</h2>
          <p>
            Keep track of the activity and growth of your donation
            platform.
          </p>
        </div>

        <div className="overview-number">
          <strong>
            {Number(stats.total_donors || 0) +
              Number(stats.total_users || 0)}
          </strong>
          <span>Total Members</span>
        </div>
      </section>
    </main>
  );
}

export default AdminStats;