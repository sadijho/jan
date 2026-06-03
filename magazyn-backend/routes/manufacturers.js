const express = require('express');
const router = express.Router();

const manufacturerController = require('../controllers/manufacturerController');

const verifyToken = require('../middleware/authMiddleware');
const verifyRole = require('../middleware/roleMiddleware');
const validate = require('../middleware/validate');

const {
  createManufacturerSchema,
  updateManufacturerSchema,
} = require('../validators/manufacturerValidator');

router.get(
  '/',
  verifyToken,
  verifyRole(['worker', 'managing director', 'admin']),
  manufacturerController.getAllManufacturers
);

router.get(
  '/:id',
  verifyToken,
  verifyRole(['worker', 'managing director', 'admin']),
  manufacturerController.getManufacturerById
);

router.post(
  '/',
  verifyToken,
  verifyRole(['admin', 'managing director']),
  validate(createManufacturerSchema),
  manufacturerController.createManufacturer
);

router.put(
  '/:id',
  verifyToken,
  verifyRole(['admin', 'managing director']),
  validate(updateManufacturerSchema),
  manufacturerController.updateManufacturer
);

router.delete(
  '/:id',
  verifyToken,
  verifyRole(['admin', 'managing director']),
  manufacturerController.deleteManufacturer
);

module.exports = router;