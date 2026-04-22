require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { startMonitoring } = require('./services/monitorService');
const metricRoutes = require('./routes/metricRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST', 'DELETE'],
  credentials: true,
}));
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'AI Monitor API running', version: '1.0.0' });
});

// Routes
app.use('/api/metrics', metricRoutes);
app.use('/api', dashboardRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: err.message });
});

// Boot
const start = async () => {
  await connectDB();
  startMonitoring();
  app.listen(PORT, () => {
    console.log(`\n🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 API endpoints:`);
    console.log(`   GET  /api/status`);
    console.log(`   GET  /api/predict`);
    console.log(`   GET  /api/metrics`);
    console.log(`   GET  /api/metrics/latest\n`);
  });
};

start();