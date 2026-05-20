const express = require('express');
const router = express.Router();
const orderProductsController = require('../controllers/orderProducts');
const verifyToken = require('../middleware/authMiddleware');
const verifyRole = require('../middleware/roleMiddleware');

// Pobieranie wszystkich produktów zamówień
router.get(
  '/',
  verifyToken,
  verifyRole(['admin', 'managing director']),
  orderProductsController.getAllOrderProducts
);

// Pobieranie produktów zamówień użytkownika
router.get(
  '/user/:userId',
  verifyToken,
  verifyRole(['worker', 'managing director', 'admin']),
  orderProductsController.getOrderProductsByUserId
);

// Pobieranie produktów zamówienia po ID
router.get(
  '/:orderId',
  verifyToken,
  verifyRole(['admin', 'managing director']),
  orderProductsController.getOrderProductsByOrderId
);

module.exports = router;