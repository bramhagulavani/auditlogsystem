require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');
const config = require('./config');
const { errorHandler } = require('./utils/errorHandler');
const log = require('./utils/logger');

// Route imports
const authRoutes = require('./routes/authRoutes');
const auditRoutes = require('./routes/auditRoutes');

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Security middleware
app.use(helmet());

// CORS
app.use(cors());

// Development logging
if (config.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/audit-logs', auditRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    message: 'Audit Log System API is running',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to Audit Log System API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      auditLogs: '/api/audit-logs',
      health: '/api/health'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use(errorHandler);

const PORT = config.PORT;

app.listen(PORT, () => {
  log.info(`Server running in ${config.NODE_ENV} mode on port ${PORT}`);
});

module.exports = app;

