import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');

  const fetchUsers = useCallback(() => {
    axios
      .get('http://localhost:5000/api/users')
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => {
        console.error(err);
        setMessage('Unable to load users');
      });
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove ${name}?`)) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`);

      setMessage(`${name} removed successfully`);
      fetchUsers();
    } catch (err) {
      setMessage(
        'Error removing user. They may have existing requests or responses linked.'
      );
    }
  };

  return (
    <main className="app-page">
      <section className="page-heading">
        <div>
          <span className="page-eyebrow">ADMINISTRATION</span>

          <h1>Manage Users</h1>

          <p>
            Review registered users and manage their access to the platform.
          </p>
        </div>

        <div className="summary-box">
          <span>Total Users</span>
          <strong>{users.length}</strong>
        </div>
      </section>

      {message && (
        <div className="feedback success">
          {message}
        </div>
      )}

      {users.length === 0 ? (
        <div className="empty-state">
          <h3>No users found</h3>
          <p>There are currently no registered users.</p>
        </div>
      ) : (
        <section className="users-card">
          <div className="users-card-header">
            <div>
              <h2>Registered Users</h2>
              <p>All users currently registered in the system.</p>
            </div>
          </div>

          <div className="users-table-wrapper">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Location</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="user-name-cell">
                        <div className="user-avatar">
                          {user.name?.charAt(0).toUpperCase() || 'U'}
                        </div>

                        <strong>{user.name}</strong>
                      </div>
                    </td>

                    <td>
                      <span className="user-email">
                        {user.email}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`role-badge role-${String(
                          user.role
                        ).toLowerCase()}`}
                      >
                        {user.role}
                      </span>
                    </td>

                    <td>
                      <span className="user-location">
                        {user.location || 'Not provided'}
                      </span>
                    </td>

                    <td>
                      <button
                        type="button"
                        className="remove-user-button"
                        onClick={() =>
                          handleDelete(user.id, user.name)
                        }
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </main>
  );
}

export default AdminUsers;