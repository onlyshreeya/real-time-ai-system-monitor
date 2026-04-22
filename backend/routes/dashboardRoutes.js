const express = require('express');
const router = express.Router();
const { getStatus, getPrediction } = require('../controllers/dashboardController');
const { triggerSpike } = require('../services/spikeState');

router.post('/simulate', (req, res) => {
  triggerSpike();
  res.json({ success: true });
});
router.get('/status', getStatus);
router.get('/predict', getPrediction);

module.exports = router;