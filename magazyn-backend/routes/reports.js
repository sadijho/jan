const express = require('express');
const router = express.Router();

const reportController = require('../controllers/reportController');

const verifyToken = require('../middleware/authMiddleware');
const verifyRole = require('../middleware/roleMiddleware');

router.get(
  '/summary',
  verifyToken,
  verifyRole(['admin', 'managing director']),
  reportController.getSummaryReport
);

module.exports = router;