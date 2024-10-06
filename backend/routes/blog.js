// backend/routes/auth.js
//title, content, image_url, status
//posts

// CREATE TABLE posts (
//   id INT AUTO_INCREMENT PRIMARY KEY,
//   title VARCHAR(255) NOT NULL,
//   content TEXT,
//   image_url VARCHAR(255),
//   status ENUM('active', 'inactive') DEFAULT 'active'
// );


const express = require('express');
const db = require('../db');
const router = express.Router();
const { body, validationResult } = require('express-validator');

// Create a new blog
router.post('/posts', [
    body('title').notEmpty().withMessage('Title is required'),
    body('status').isIn(['active', 'inactive']).withMessage('Status must be either active or inactive')
    // Add other validations as necessary
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { title, content, image_url, status } = req.body;
    const sql = 'INSERT INTO posts (title, content, image_url, status) VALUES (?, ?, ?, ?)'; // Corrected

    db.query(sql, [title, content, image_url, status], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Database query error' });
        }
        res.status(201).json({ id: result.insertId, title });
    });
});

// Show a blog by ID
router.get('/posts/:id', (req, res) => {
    const sql = 'SELECT * FROM posts WHERE id = ?';

    db.query(sql, [req.params.id], (err, result) => {
        if (err || result.length === 0) {
            return res.status(404).json({ error: 'Blog not found' });
        }
        res.json(result[0]);
    });
});

// Update a blog
router.put('/posts/:id', [
    body('title').optional().notEmpty().withMessage('Title cannot be empty'),
    body('status').optional().isIn(['active', 'inactive']).withMessage('Status must be either active or inactive')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { title, content, image_url, status } = req.body;
    const sql = 'UPDATE posts SET title = ?, content = ?, image_url = ?, status = ? WHERE id = ?';

    db.query(sql, [title, content, image_url, status, req.params.id], (err, result) => {
        if (err || result.affectedRows === 0) {
            return res.status(404).json({ error: 'Blog not found' });
        }
        res.json({ message: 'Blog updated successfully' });
    });
});

// Delete a blog
router.delete('/posts/:id', (req, res) => {
    const sql = 'DELETE FROM posts WHERE id = ?';

    db.query(sql, [req.params.id], (err, result) => {
        if (err || result.affectedRows === 0) {
            return res.status(404).json({ error: 'Blog not found' });
        }
        res.json({ message: 'Blog deleted successfully' });
    });
});

// Fetch all posts
router.get('/posts', (req, res) => {
    const sql = 'SELECT * FROM posts';
    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Database query error' });
        }
        res.json(result);
    });
});

module.exports = router;
