const express = require('express');
const router = express.Router();
const tableController = require('../controllers/tableController');
const verifyToken = require('../middleware/authMiddleware');
const verifyRole = require('../middleware/roleMiddleware');

// Lista ról (tylko admin)
router.get('/roles', verifyToken, verifyRole(['admin']), tableController.getRoles);

// Lista lokalizacji magazynowych (managing director, admin)
router.get('/warehouselocations', verifyToken, verifyRole(['managing director', 'admin']), tableController.getWarehouseLocations);

// Lista produktów w zamówieniach (tylko admin)
router.get('/orderproducts', verifyToken, verifyRole(['admin']), tableController.getOrderProducts);

module.exports = router;
