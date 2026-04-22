const Metric = require('../models/Metric');

// POST /api/metrics — save a metric manually (optional, monitorService handles auto-save)
const saveMetric = async (req, res) => {
  try {
    const { cpuUsage, memUsage, diskUsage, networkRx, networkTx } = req.body;
    const metric = new Metric({ cpuUsage, memUsage, diskUsage, networkRx, networkTx });
    await metric.save();
    res.status(201).json({ success: true, data: metric });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/metrics?limit=50&minutes=10
const getMetrics = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const minutes = parseInt(req.query.minutes) || 10;
    const since = new Date(Date.now() - minutes * 60 * 1000);

    const metrics = await Metric.find({ timestamp: { $gte: since } })
      .sort({ timestamp: -1 })
      .limit(limit)
      .lean();

    res.json({ success: true, count: metrics.length, data: metrics.reverse() });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/metrics/latest
const getLatestMetric = async (req, res) => {
  try {
    const metric = await Metric.findOne().sort({ timestamp: -1 }).lean();
    res.json({ success: true, data: metric });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { saveMetric, getMetrics, getLatestMetric };