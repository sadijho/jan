const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const verifyToken = require('../middleware/authMiddleware');
const verifyRole = require('../middleware/roleMiddleware');
const validate = require('../middleware/validate');
const { createOrderSchema, updateOrderStatusSchema } = require('../validators/orderValidator');

// Tworzenie zamówienia
router.post(
  '/',
  verifyToken,
  verifyRole(['worker', 'managing director', 'admin']),
  validate(createOrderSchema),
  orderController.createOrder
);

// Pobieranie zamówień
router.get(
  '/',
  verifyToken,
  verifyRole(['worker', 'managing director', 'admin']),
  orderController.getOrders
);

router.get(
  '/:id',
  verifyToken,
  verifyRole(['worker', 'managing director', 'admin']),
  orderController.getOrderById
);

// Aktualizacja statusu zamówienia
router.put(
  '/:id',
  verifyToken,
  verifyRole(['worker', 'managing director', 'admin']),
  validate(updateOrderStatusSchema),
  orderController.updateOrderStatus
);

// Pobieranie historii zamówienia
router.get(
  '/:id/history',
  verifyToken,
  verifyRole(['managing director', 'admin','worker']),
  orderController.getOrderHistory
);



module.exports = router;
