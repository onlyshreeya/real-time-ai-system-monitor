let simulateSpike = false;

module.exports = {
  triggerSpike: () => { simulateSpike = true; },
  getSpike: () => simulateSpike,
  resetSpike: () => { simulateSpike = false; }
};