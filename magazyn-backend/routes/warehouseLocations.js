const express = require('express');
const router = express.Router();

const warehouseController = require('../controllers/warehouseLocations');

const verifyToken = require('../middleware/authMiddleware');
const verifyRole = require('../middleware/roleMiddleware');
const validate = require('../middleware/validate');

const {
  createWarehouseSchema,
} = require('../validators/warehouseValidator');

// Pobieranie wszystkich lokalizacji
router.get(
  '/',
  verifyToken,
  verifyRole(['worker', 'managing director', 'admin']),
  warehouseController.getWarehouseLocations
);

// Pobieranie lokalizacji po ID
router.get(
  '/:id',
  verifyToken,
  verifyRole(['worker', 'managing director', 'admin']),
  warehouseController.getWarehouseLocationById
);

// Tworzenie lokalizacji
router.post(
  '/',
  verifyToken,
  verifyRole(['admin']),
  validate(createWarehouseSchema),
  warehouseController.createWarehouseLocation
);

// Usuwanie lokalizacji
router.delete(
  '/:id',
  verifyToken,
  verifyRole(['admin']),
  warehouseController.deleteWarehouseLocation
);

module.exports = router;