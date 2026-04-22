const si = require('systeminformation');
const Metric = require('../models/Metric');
const { getSpike, resetSpike } = require('./spikeState');

let latestMetrics = {
  cpuUsage: 0,
  memUsage: 0,
  diskUsage: 0,
  networkRx: 0,
  networkTx: 0,
  timestamp: new Date(),
};

const collectAndSave = async () => {
  try {
    const [cpuLoad, mem, disk, networkStats] = await Promise.all([
      si.currentLoad(),
      si.mem(),
      si.fsSize(),
      si.networkStats(),
    ]);

    let cpuUsage = parseFloat(cpuLoad.currentLoad.toFixed(2));
    if (getSpike()) {
  cpuUsage = Math.min(95, cpuUsage + 40);
  resetSpike();
}
    const memUsage = parseFloat(((mem.used / mem.total) * 100).toFixed(2));
    const diskUsage = disk.length > 0
      ? parseFloat(((disk[0].used / disk[0].size) * 100).toFixed(2))
      : 0;
    const networkRx = networkStats.length > 0
      ? parseFloat((networkStats[0].rx_sec / 1024 / 1024).toFixed(3))
      : 0;
    const networkTx = networkStats.length > 0
      ? parseFloat((networkStats[0].tx_sec / 1024 / 1024).toFixed(3))
      : 0;

    const metric = new Metric({ cpuUsage, memUsage, diskUsage, networkRx, networkTx });
    await metric.save();

    latestMetrics = { cpuUsage, memUsage, diskUsage, networkRx, networkTx, timestamp: new Date() };

    console.log(`[Monitor] CPU: ${cpuUsage}% | MEM: ${memUsage}% | DISK: ${diskUsage}%`);
  } catch (err) {
    console.error('[Monitor] Collection error:', err.message);
  }
};

const getLatestMetrics = () => latestMetrics;

const startMonitoring = () => {
  const interval = parseInt(process.env.COLLECT_INTERVAL_MS) || 5000;
  collectAndSave(); // immediate first run
  setInterval(collectAndSave, interval);
  console.log(`[Monitor] Started. Collecting every ${interval}ms`);
};

module.exports = { startMonitoring, getLatestMetrics };