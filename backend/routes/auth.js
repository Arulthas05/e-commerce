// backend/routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

const router = express.Router();

// User Registration
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const userCheckQuery = "SELECT * FROM users WHERE email = ?";
    db.query(userCheckQuery, [email], async (err, results) => {
      if (err) {
        console.error('Database query error:', err); // Log the error
        return res.status(500).json({ message: "Server error" });
      }

      if (results.length > 0) {
        return res.status(400).json({ message: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const query =
        "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)";
      db.query(
        query,
        [username, email, hashedPassword, 'user'], // Include the default role here
        (err, result) => {
          if (err) {
            console.error('Insert error:', err); // Log the error
            return res.status(500).json({ message: "Server error" });
          }

          // Generate JWT token
          const token = jwt.sign({ id: result.insertId, role: 'user' }, process.env.JWT_SECRET, { expiresIn: '1h' });

          res.status(201).json({
            message: "User registered successfully",
            userId: result.insertId,
            token: token, // Include the generated token in the response
          });
        }
      );
    });
  } catch (err) {
    console.error('Server error:', err); // Log the error
    res.status(500).json({ message: "Server error" });
  }
});


// Create Admin Route
router.post("/create-admin", async (req, res) => {
  const { username, email, password } = req.body;

  // Validate input
  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if the user already exists
    const userCheckQuery = "SELECT * FROM users WHERE email = ?";
    db.query(userCheckQuery, [email], async (err, results) => {
      if (err) {
        console.error('Database query error:', err);
        return res.status(500).json({ message: "Server error" });
      }

      if (results.length > 0) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash password and insert user with role 'admin'
      const hashedPassword = await bcrypt.hash(password, 10);
      const query = "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)";

      db.query(query, [username, email, hashedPassword, 'admin'], (err, result) => {
        if (err) {
          console.error('Insert error:', err);
          return res.status(500).json({ message: "Server error" });
        }
        res.status(201).json({ message: "Admin user created successfully", userId: result.insertId });
      });
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: "Server error" });
  }
});


router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const query = "SELECT * FROM users WHERE email = ?";
    db.query(query, [email], async (err, results) => {
      if (err) {
        console.error('Database query error:', err);
        return res.status(500).json({ message: "Server error" });
      }

      if (results.length === 0) {
        return res.status(400).json({ message: "User not found" });
      }

      const user = results[0];
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Generate JWT token
      const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.json({
        message: "Login successful",
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role // Include the role in the response
        },
      });
    });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ message: "Server error" });
  }
});


// Edit User Route without authentication
router.put("/register/:id", async (req, res) => {
  const { id } = req.params;
  const { username, email, password, role } = req.body; // Include role in request body

  try {
    const updateFields = [];
    const values = [];

    if (username) {
      updateFields.push("username = ?");
      values.push(username);
    }
    if (email) {
      updateFields.push("email = ?");
      values.push(email);
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateFields.push("password = ?");
      values.push(hashedPassword);
    }
    if (role) { // Check if role is provided
      updateFields.push("role = ?");
      values.push(role);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    values.push(id);
    const query = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`;

    db.query(query, values, (err, result) => {
      if (err) {
        console.error('Update error:', err);
        return res.status(500).json({ message: "Server error" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ message: "User updated successfully" });
    });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete User Route without authentication
router.delete("/users/:id", (req, res) => {
  const { id } = req.params;

  const query = "DELETE FROM users WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Delete error:', err);
      return res.status(500).json({ message: "Server error" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  });
});
router.get('/users', (req, res) => {
  const query = 'SELECT * FROM users';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching users:', err);
      return res.status(500).json({ error: 'Failed to fetch users' });
    }
    res.status(200).json(results);
  });
});



module.exports = router;
