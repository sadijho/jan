const express = require('express');
const router = express.Router();
const orderHistoryController = require('../controllers/orderHistory');
const verifyToken = require('../middleware/authMiddleware');
const verifyRole = require('../middleware/roleMiddleware');

// Pobieranie wszystkich wpisów z historii zamówień (tylko admin)
router.get('/', verifyToken, verifyRole(['admin', 'managing director']), orderHistoryController.getAllOrderHistory);

// Pobieranie historii zamówienia po ID zamówienia
router.get('/:orderId', verifyToken, verifyRole(['managing director', 'admin','worker']), orderHistoryController.getOrderHistoryByOrderId);

// Tworzenie wpisu w historii zamówienia
router.post('/', verifyToken, verifyRole(['admin']), orderHistoryController.createOrderHistory);

module.exports = router;
