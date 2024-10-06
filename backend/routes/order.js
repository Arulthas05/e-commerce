// backend/routes/order.js
const express = require('express');
const db = require('../db');
const router = express.Router();

router.post('/orders', (req, res) => {
    const { userId, items, address, phone } = req.body;

    console.log('Received order data:', req.body);

    // Validate input
    if (!userId || !Array.isArray(items) || items.length === 0 || !address || !phone) {
        return res.status(400).json({ message: 'Invalid input' });
    }

    let total = 0;
    let values = [];

    const productIds = items.map(item => item.productId);
    const sql = 'SELECT id, price FROM products WHERE id IN (?)';

    db.query(sql, [productIds], (err, products) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error' });
        }

        products.forEach(product => {
            const item = items.find(i => i.productId === product.id);
            if (item) {
                total += item.quantity * product.price;
                values.push([0, product.id, item.quantity, product.price]);
            }
        });

        const validItems = items.filter(item => item.productId && item.quantity > 0);
        console.log('Valid items:', validItems);

if (validItems.length === 0) {
    return res.status(400).json({ message: 'No valid items to order.' });
}

        const orderQuery = 'INSERT INTO orders (user_id, total, address, phone) VALUES (?, ?, ?, ?)';
        db.query(orderQuery, [userId, total, address, phone], (err, result) => {
            if (err) {
                console.error('Failed to create order:', err);
                return res.status(500).json({ message: 'Failed to create order' });
            }

            const orderId = result.insertId;
            const orderItemsQuery = 'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ?';
            values = values.map(value => [orderId, ...value.slice(1)]);

            db.query(orderItemsQuery, [values], (err) => {
                if (err) {
                    console.error('Failed to insert order items:', err);
                    return res.status(500).json({ message: 'Failed to insert order items' });
                }

                res.status(201).json({ message: 'Order placed successfully', orderId });
            });
        });
    });
});

  
router.get('/orders:id', (req, res) => {
    const orderId = req.params.id;
    const sql = `
      SELECT o.id as order_id, o.total, o.address, o.phone, oi.product_id, oi.quantity, oi.price, p.name as product_name
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      JOIN products p ON oi.product_id = p.id
      WHERE o.id = ?
    `;
  
    db.query(sql, [orderId], (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      const order = {
        orderId: results[0].order_id,
        total: results[0].total,
        address: results[0].address,
        phone: results[0].phone,
        items: results.map(row => ({
          productId: row.product_id,
          productName: row.product_name,
          quantity: row.quantity,
          price: row.price
        }))
      };
  
      res.json(order);
    });
  });

  router.get('/orders', (req, res) => {
    const sql = `
      SELECT o.id as order_id, o.total, o.address, o.phone, oi.product_id, oi.quantity, oi.price, p.name as product_name
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      JOIN products p ON oi.product_id = p.id
    `;

    // Fetch all orders with their order items
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'No orders found' });
        }

        // Group orders by order_id
        const orders = results.reduce((acc, row) => {
            if (!acc[row.order_id]) {
                acc[row.order_id] = {
                    orderId: row.order_id,
                    total: row.total,
                    address: row.address,
                    phone: row.phone,
                    items: []
                };
            }

            acc[row.order_id].items.push({
                productId: row.product_id,
                productName: row.product_name,
                quantity: row.quantity,
                price: row.price
            });

            return acc;
        }, {});

        // Convert the orders object into an array of orders
        const ordersArray = Object.values(orders);

        res.json(ordersArray);
    });
});


// DELETE /api/orders/:id
router.delete('/orders/:id', (req, res) => {
  const orderId = req.params.id;

  // First, delete the items associated with the order
  const deleteOrderItemsQuery = 'DELETE FROM order_items WHERE order_id = ?';
  db.query(deleteOrderItemsQuery, [orderId], (err, result) => {
      if (err) {
          console.error('Failed to delete order items:', err);
          return res.status(500).json({ message: 'Failed to delete order items' });
      }

      // Then, delete the order itself
      const deleteOrderQuery = 'DELETE FROM orders WHERE id = ?';
      db.query(deleteOrderQuery, [orderId], (err, result) => {
          if (err) {
              console.error('Failed to delete order:', err);
              return res.status(500).json({ message: 'Failed to delete order' });
          }

          if (result.affectedRows === 0) {
              return res.status(404).json({ message: 'Order not found' });
          }

          res.status(200).json({ message: 'Order deleted successfully' });
      });
  });
});



module.exports = router;
