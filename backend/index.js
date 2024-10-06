// backend/index.js
const express = require('express');
const cors = require('cors');
const db = require('./db');
const productRoutes = require('./routes/products');
const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/order');
const blogRoutes = require('./routes/blog');
const reviewRoutes = require('./routes/review');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Routes
app.get('/', (req, res) => {
  res.send('E-commerce API Running...');
});

app.use('/api', productRoutes,orderRoutes,blogRoutes,reviewRoutes);
app.use('/api/auth', authRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
