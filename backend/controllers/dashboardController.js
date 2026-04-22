console.log("Calling ML service:", process.env.PYTHON_API_URL);
const Metric = require('../models/Metric');
const { getLatestMetrics } = require('../services/monitorService');
const si = require('systeminformation');

const THRESHOLD = parseFloat(process.env.PREDICTION_THRESHOLD) || 60;

// GET /api/status
const getStatus = async (req, res) => {
  try {
    const latest = getLatestMetrics();
    const dbCount = await Metric.countDocuments();

    res.json({
      success: true,
      data: {
        ...latest,
        dbRecords: dbCount,
        uptime: process.uptime(),
        nodeVersion: process.version,
        threshold: THRESHOLD,
        healthy: latest.cpuUsage < THRESHOLD && latest.memUsage < 90,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
async function getTopProcesses() {
  const data = await si.processes();

  return data.list
    .filter(p =>
      p.cpu > 1 && // ignore tiny usage
      !p.name.toLowerCase().includes('idle') &&
      !p.name.toLowerCase().includes('system')
    )
    .sort((a, b) => b.cpu - a.cpu)
    .slice(0, 3)
    .map(p => ({
      name: p.name,
      cpu: p.cpu,
      mem: p.mem
    }));
}
// GET /api/predict?points=20
const getPrediction = async (req, res) => {
  try {
    const points = parseInt(req.query.points) || 20;

    // Fetch recent CPU values from DB
    const recent = await Metric.find()
      .sort({ timestamp: -1 })
      .limit(points)
      .select('cpuUsage -_id')
      .lean();

    const cpuValues = recent.map((m) => m.cpuUsage).reverse();
    // ---- Anomaly Detection ----
    function detectAnomaly(values) {
      if (values.length < 10) return false;

      const mean = values.reduce((a, b) => a + b, 0) / values.length;
      const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
      const stdDev = Math.sqrt(variance);

      const latest = values[values.length - 1];
      const zScore = (latest - mean) / (stdDev || 1);

      return Math.abs(zScore) > 1.2;
    }

    const anomaly = detectAnomaly(cpuValues);

    // ---- Get processes ----
    const topProcesses = await getTopProcesses();

    // ---- Explain cause ----
    function generateInsight(processes, prediction) {
      if (!processes || processes.length === 0) {
        return {
          cause: "CPU spike detected but no clear process found",
          suggestion: "Monitor system or restart background services"
        };
      }

      const top = processes[0];

      // 🔥 CPU heavy
      if (top.cpu > 50) {
        return {
          cause: `${top.name} is heavily using CPU (${top.cpu.toFixed(1)}%)`,
          suggestion: `Consider stopping or optimizing ${top.name}`
        };
      }

      if (top.cpu > 25) {
        return {
          cause: `${top.name} is contributing to CPU load`,
          suggestion: `Reduce workload or limit instances of ${top.name}`
        };
      }

      // 🧠 memory heavy
      if (top.mem > 40) {
        return {
          cause: `${top.name} is consuming high memory (${top.mem.toFixed(1)}%)`,
          suggestion: `Check memory usage or restart ${top.name}`
        };
      }

      return {
        cause: "Sudden system activity detected",
        suggestion: "Observe system for unusual background tasks"
      };
    }
    if (cpuValues.length < 2) {
      return res.json({
        success: true,
        data: {
          prediction: 0,
          confidence: 0,
          alert: false,
          message: 'Not enough data yet. Wait a few seconds...',
          cpuValues,
        },
      });
    }

    // Call Python ML model
    const response = await fetch(process.env.PYTHON_API_URL + '/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ values: cpuValues })
    });

    const result = await response.json();
    let cause = null;
    let suggestion = null;

    if (anomaly) {
      const insight = generateInsight(topProcesses, result.prediction);
      cause = insight.cause;
      suggestion = insight.suggestion;
    }

    const alert = result.prediction > THRESHOLD;
    const message = alert
      ? `High load predicted (${result.prediction.toFixed(1)}%). Consider scaling or reducing load.`
      : `System stable. Predicted CPU: ${result.prediction.toFixed(1)}%`;

    res.json({
      success: true,
      data: {
        ...result,
        alert,
        anomaly,
        cause,
        suggestion, // 👈 ADD THIS
        threshold: THRESHOLD,
        message,
        cpuValues,
        dataPoints: cpuValues.length,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};


module.exports = { getStatus, getPrediction };