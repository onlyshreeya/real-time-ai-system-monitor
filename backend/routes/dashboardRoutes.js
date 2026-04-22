const express = require('express');
const router = express.Router();
const { getStatus, getPrediction } = require('../controllers/dashboardController');
const { triggerSpike } = require('../services/spikeState');

router.post('/simulate', (req, res) => {
  triggerSpike(); // 🔥 THIS WAS MISSING
  res.json({ success: true, message: 'Simulated load' });
});
router.get('/status', getStatus);
router.get('/predict', getPrediction);

module.exports = router;