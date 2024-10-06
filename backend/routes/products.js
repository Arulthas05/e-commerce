// backend/routes/products.js
const express = require('express');
const db = require('../db');
const router = express.Router();

const { body, validationResult } = require('express-validator');

// Create a new product
router.post('/products', [
    body('name').notEmpty().withMessage('Name is required'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0'),
    body('stock').isInt({ gt: -1 }).withMessage('Stock must be a non-negative integer'),
    // Add other validations as necessary
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, price, image_url, brand, stock, status } = req.body;
    const sql = 'INSERT INTO products (name, description, price, image_url, brand, stock, status) VALUES (?, ?, ?, ?, ?, ?, ?)';
    
    db.query(sql, [name, description, price, image_url, brand, stock, status], (err, result) => {
        if (err) {
            res.status(500).json({ error: 'Database query error' });
        } else {
            res.status(201).json({ id: result.insertId, name });
        }
    });
});


// Show a product by ID
router.get('/products/:id', (req, res) => {
    const sql = 'SELECT * FROM products WHERE id = ?';
    
    db.query(sql, [req.params.id], (err, result) => {
        if (err || result.length === 0) {
            res.status(404).json({ error: 'Product not found' });
        } else {
            res.json(result[0]);
        }
    });
});

// Update a product
router.put('/products/:id', (req, res) => {
    const { name, description, price, image_url, brand, stock, status } = req.body;
    const sql = 'UPDATE products SET name = ?, description = ?, price = ?, image_url = ?, brand = ?, stock = ?, status = ? WHERE id = ?';
    
    db.query(sql, [name, description, price, image_url, brand, stock, status, req.params.id], (err, result) => {
        if (err || result.affectedRows === 0) {
            res.status(404).json({ error: 'Product not found' });
        } else {
            res.json({ message: 'Product updated successfully' });
        }
    });
});

// Delete a product
router.delete('/products/:id', (req, res) => {
    const sql = 'DELETE FROM products WHERE id = ?';
    
    db.query(sql, [req.params.id], (err, result) => {
        if (err || result.affectedRows === 0) {
            res.status(404).json({ error: 'Product not found' });
        } else {
            res.json({ message: 'Product deleted successfully' });
        }
    });
});

// Fetch all products
router.get('/products', (req, res) => {
    const sql = 'SELECT * FROM products';
    db.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ error: 'Database query error' });
        } else {
            res.json(result);
        }
    });
});

module.exports = router;
