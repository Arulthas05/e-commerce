const express = require('express');
const db = require('../db');
const router = express.Router();

// Create a review
router.post('/reviews', (req, res) => {
    const { review_text, rating, user_id, status } = req.body; // Add status
    const query = 'INSERT INTO reviews (review_text, rating, user_id, status) VALUES (?, ?, ?, ?)';
    
    db.query(query, [review_text, rating, user_id, status || 'pending'], (err, results) => {
      if (err) {
        console.error('Error inserting review:', err);
        return res.status(500).json({ error: 'Failed to create review' });
      }
      res.status(201).json({ message: 'Review created successfully', reviewId: results.insertId });
    });
  });
  
  // Get all reviews
  // router.get('/reviews', (req, res) => {
  //   const query = 'SELECT * FROM reviews';
    
  //   db.query(query, (err, results) => {
  //     if (err) {
  //       console.error('Error fetching reviews:', err);
  //       return res.status(500).json({ error: 'Failed to fetch reviews' });
  //     }
  //     res.json(results);
  //   });
  // });

  router.get('/reviews', (req, res) => {
    const query = `
      SELECT reviews.id, reviews.review_text, reviews.rating, reviews.status, users.username AS user_name
      FROM reviews
      JOIN users ON reviews.user_id = users.id
    `;
  
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching reviews:', err);
        return res.status(500).json({ error: 'Failed to fetch reviews' });
      }
      res.json(results);
    });
  });
  
  
  
  // Update a review
  router.put('/reviews/:id', (req, res) => {
    const { id } = req.params;
    const { review_text, rating, status } = req.body; // Add status
    const query = 'UPDATE reviews SET review_text = ?, rating = ?, status = ? WHERE id = ?';
    
    db.query(query, [review_text, rating, status, id], (err, results) => {
      if (err) {
        console.error('Error updating review:', err);
        return res.status(500).json({ error: 'Failed to update review' });
      }
      res.json({ message: 'Review updated successfully' });
    });
  });
  
  
  // Delete a review
  router.delete('/reviews/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM reviews WHERE id = ?';
    
    db.query(query, [id], (err, results) => {
      if (err) {
        console.error('Error deleting review:', err);
        return res.status(500).json({ error: 'Failed to delete review' });
      }
      res.json({ message: 'Review deleted successfully' });
    });
  });

  module.exports = router;