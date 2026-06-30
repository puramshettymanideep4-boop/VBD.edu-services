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

// ── CORS ──────────────────────────────────────────────────────────────────────
// Must be registered BEFORE all other middleware so preflight OPTIONS
// requests are answered correctly without hitting auth/rate-limit layers.

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
  'https://vbd-edu-services.onrender.com',
  'https://vbd-edu-services.vercel.app',
];

// Add any extra frontend URL set via env (e.g. Vercel deployment URL)
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no Origin header (Postman, curl, server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: origin "${origin}" is not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

// Explicitly respond to ALL preflight OPTIONS requests BEFORE any other middleware
// Note: Express 5 uses '/{*path}' instead of '*' for catch-all routes
app.options('/{*path}', cors(corsOptions));

// ── Security ──────────────────────────────────────────────────────────────────
app.use(helmet());

// ── Body Parsers ──────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Logging ───────────────────────────────────────────────────────────────────
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ── Rate Limiting ─────────────────────────────────────────────────────────────
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests from this IP, please try again after 15 minutes',
});
app.use('/api/', apiLimiter);

// ── Static Files ──────────────────────────────────────────────────────────────
app.use('/uploads', express.static('uploads'));

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/schools', schoolRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/cms', cmsRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'VBD API is running ✅', status: 'ok' });
});

// Dev-only seed endpoint
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

// ── Error Handling ────────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

module.exports = app;
