const mongoose = require('mongoose');

const MetricSchema = new mongoose.Schema({
  cpuUsage: {
    type: Number,
    required: true,
  },
  memUsage: {
    type: Number,
    required: true,
  },
  diskUsage: {
    type: Number,
    default: 0,
  },
  networkRx: {
    type: Number,
    default: 0,
  },
  networkTx: {
    type: Number,
    default: 0,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Auto-delete records older than 24 hours
MetricSchema.index({ timestamp: 1 }, { expireAfterSeconds: 86400 });

module.exports = mongoose.model('Metric', MetricSchema);