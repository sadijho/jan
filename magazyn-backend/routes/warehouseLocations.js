const express = require('express');
const router = express.Router();
const warehouseController = require('../controllers/warehouseLocations');
const verifyToken = require('../middleware/authMiddleware');
const verifyRole = require('../middleware/roleMiddleware');

router.get('/', verifyToken, verifyRole(['managing director', 'admin']), warehouseController.getWarehouseLocations);
router.get('/:id', verifyToken, verifyRole(['managing director', 'admin']), warehouseController.getWarehouseLocationById);
router.post('/', verifyToken, verifyRole(['admin']), warehouseController.createWarehouseLocation);
router.delete('/:id', verifyToken, verifyRole(['admin']), warehouseController.deleteWarehouseLocation);

module.exports = router;
