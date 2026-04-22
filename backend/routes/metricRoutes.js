const express = require('express');
const router = express.Router();
const { saveMetric, getMetrics, getLatestMetric } = require('../controllers/metricController');

router.post('/', saveMetric);
router.get('/', getMetrics);
router.get('/latest', getLatestMetric);

module.exports = router;