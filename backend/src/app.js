const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

// Import routes
const authRoutes = require('./routes/authRoutes');
const schoolRoutes = require('./routes/schoolRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const cmsRoutes = require('./routes/cmsRoutes');

const app = express();

// Middleware
app.use(helmet()); // Security headers
app.use(cors({ origin: 'http://localhost:5173', credentials: true })); // Enable CORS for frontend
app.use(express.json()); // Body parser
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); // Logging
}

// Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message: 'Too many requests from this IP, please try again after 15 minutes',
});
app.use('/api/', apiLimiter);

// Make uploads folder static
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/schools', schoolRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/cms', cmsRoutes);

app.get('/', (req, res) => {
  res.send('VBD API is running...');
});

// Dev-only seed endpoint — seeds DB in the context of the running server (works with embedded MongoDB)
if (process.env.NODE_ENV === 'development') {
  app.post('/api/seed', async (req, res) => {
    try {
      const importData = require('./utils/seeder');
      await importData();
      res.json({ success: true, message: 'Database seeded successfully!' });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  });
}

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

module.exports = app;
