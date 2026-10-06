const express = require('express');
const db = require('./db');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Blood Request Network backend is running!');
});

app.post('/api/register', (req, res) => {
  const { name, email, password, phone, role, location } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'Please fill all required fields' });
  }

  const sql = 'INSERT INTO users (name, email, password, phone, role, location) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(sql, [name, email, password, phone, role, location], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Something went wrong', error: err.message });
    }
    res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
  });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const sql = 'SELECT * FROM users WHERE email = ?';
  db.query(sql, [email], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Something went wrong' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = results[0];

    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  });
});

app.post('/api/requests', (req, res) => {
  const { user_id, blood_group, units_needed, hospital, urgency } = req.body;

  if (!user_id || !blood_group || !units_needed || !hospital || !urgency) {
    return res.status(400).json({ message: 'Please fill all required fields' });
  }

  const sql = 'INSERT INTO requests (user_id, blood_group, units_needed, hospital, urgency) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [user_id, blood_group, units_needed, hospital, urgency], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Something went wrong', error: err.message });
    }
    res.status(201).json({ message: 'Blood request posted successfully', requestId: result.insertId });
  });
});

// Donor view — only requests that have actually been broadcasted
app.get('/api/requests', (req, res) => {
  const sql = `
    SELECT requests.id, requests.blood_group, requests.units_needed, 
           requests.hospital, requests.urgency, requests.status, 
           requests.created_at, users.name AS requested_by
    FROM requests
    JOIN users ON requests.user_id = users.id
    WHERE requests.status = 'broadcasted'
    ORDER BY requests.created_at DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Something went wrong' });
    }
    res.status(200).json(results);
  });
});

// Admin view — every request regardless of status, so admin can verify/broadcast pending ones
app.get('/api/admin/requests', (req, res) => {
  const sql = `
    SELECT requests.id, requests.blood_group, requests.units_needed, 
           requests.hospital, requests.urgency, requests.status, 
           requests.created_at, users.name AS requested_by
    FROM requests
    JOIN users ON requests.user_id = users.id
    ORDER BY requests.created_at DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Something went wrong' });
    }
    res.status(200).json(results);
  });
});

app.post('/api/responses', (req, res) => {
  const { request_id, donor_id } = req.body;

  if (!request_id || !donor_id) {
    return res.status(400).json({ message: 'Request ID and Donor ID are required' });
  }

  const sql = 'INSERT INTO responses (request_id, donor_id, status) VALUES (?, ?, ?)';
  db.query(sql, [request_id, donor_id, 'accepted'], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Something went wrong', error: err.message });
    }
    res.status(201).json({ message: 'Response recorded successfully', responseId: result.insertId });
  });
});

app.put('/api/requests/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['pending', 'verified', 'broadcasted', 'fulfilled', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  const sql = 'UPDATE requests SET status = ? WHERE id = ?';
  db.query(sql, [status, id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Something went wrong', error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Request not found' });
    }
    res.status(200).json({ message: `Request status updated to '${status}'` });
  });
});

// ---------- USER MODULE ----------

// View own request history
app.get('/api/users/:id/requests', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM requests WHERE user_id = ? ORDER BY created_at DESC', [id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching requests' });
    res.json(results);
  });
});

// Edit a pending request
app.put('/api/requests/:id', (req, res) => {
  const { id } = req.params;
  const { blood_group, units_needed, hospital, urgency } = req.body;
  const sql = 'UPDATE requests SET blood_group=?, units_needed=?, hospital=?, urgency=? WHERE id=? AND status="pending"';
  db.query(sql, [blood_group, units_needed, hospital, urgency, id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error updating request' });
    if (result.affectedRows === 0) return res.status(400).json({ message: 'Cannot edit — request not pending or not found' });
    res.json({ message: 'Request updated successfully' });
  });
});

// Cancel/delete a request
app.delete('/api/requests/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM requests WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error deleting request' });
    res.json({ message: 'Request deleted successfully' });
  });
});

// View donors who responded to a specific request
app.get('/api/requests/:id/responses', (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT responses.id, responses.status, responses.responded_at,
           users.name AS donor_name, users.phone, users.email
    FROM responses
    JOIN users ON responses.donor_id = users.id
    WHERE responses.request_id = ?
  `;
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching responses' });
    res.json(results);
  });
});

// Update profile (also used by Donor module)
app.put('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const { name, phone, location, availability, last_donation_date } = req.body;
  const sql = 'UPDATE users SET name=?, phone=?, location=?, availability=?, last_donation_date=? WHERE id=?';
  db.query(sql, [name, phone, location, availability, last_donation_date, id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error updating profile' });
    res.json({ message: 'Profile updated successfully' });
  });
});

// ---------- DONOR MODULE ----------

// Decline a request
app.post('/api/responses/decline', (req, res) => {
  const { request_id, donor_id } = req.body;
  const sql = 'INSERT INTO responses (request_id, donor_id, status) VALUES (?, ?, ?)';
  db.query(sql, [request_id, donor_id, 'declined'], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error declining request' });
    res.json({ message: 'Request declined' });
  });
});

// View own donation history
app.get('/api/users/:id/responses', (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT responses.id, responses.status, responses.responded_at,
           requests.blood_group, requests.hospital, requests.units_needed
    FROM responses
    JOIN requests ON responses.request_id = requests.id
    WHERE responses.donor_id = ?
    ORDER BY responses.responded_at DESC
  `;
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching donation history' });
    res.json(results);
  });
});

// ---------- ADMIN MODULE ----------

// View all users
app.get('/api/users', (req, res) => {
  db.query('SELECT id, name, email, phone, role, location, availability, created_at FROM users', (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching users' });
    res.json(results);
  });
});

// Block/delete a user
app.delete('/api/users/:id', (req, res) => {
  const { id } = req.params;

  // Step 1: delete this user's responses (as a donor)
  db.query('DELETE FROM responses WHERE donor_id = ?', [id], (err1) => {
    if (err1) {
      console.error(err1);
      return res.status(500).json({ message: 'Error removing related responses' });
    }

    // Step 2: delete responses made ON this user's requests (by other donors)
    db.query('DELETE FROM responses WHERE request_id IN (SELECT id FROM requests WHERE user_id = ?)', [id], (err2) => {
      if (err2) {
        console.error(err2);
        return res.status(500).json({ message: 'Error removing related responses' });
      }

      // Step 3: delete this user's requests
      db.query('DELETE FROM requests WHERE user_id = ?', [id], (err3) => {
        if (err3) {
          console.error(err3);
          return res.status(500).json({ message: 'Error removing related requests' });
        }

        // Step 4: finally delete the user
        db.query('DELETE FROM users WHERE id = ?', [id], (err4, result) => {
          if (err4) {
            console.error(err4);
            return res.status(500).json({ message: 'Error deleting user' });
          }
          res.json({ message: 'User and all related data removed successfully' });
        });
      });
    });
  });
});

// Basic statistics
app.get('/api/stats', (req, res) => {
  const sql = `
    SELECT
      (SELECT COUNT(*) FROM requests) AS total_requests,
      (SELECT COUNT(*) FROM requests WHERE status = 'pending') AS pending_requests,
      (SELECT COUNT(*) FROM requests WHERE status = 'fulfilled') AS fulfilled_requests,
      (SELECT COUNT(*) FROM users WHERE role = 'donor') AS total_donors,
      (SELECT COUNT(*) FROM users WHERE role = 'user') AS total_users
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching stats' });
    res.json(results[0]);
  });
});


const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});