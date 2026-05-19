const express = require('express');
const router = express.Router();
const orderProductsController = require('../controllers/orderProducts');
const verifyToken = require('../middleware/authMiddleware');
const verifyRole = require('../middleware/roleMiddleware');

// Pobieranie wszystkich produktów zamówień (z paginacją)
router.get('/', verifyToken, verifyRole(['admin','managing director']), orderProductsController.getAllOrderProducts);

// Pobieranie produktów zamówienia po ID zamówienia
router.get('/:orderId', verifyToken, verifyRole(['admin']), orderProductsController.getOrderProductsByOrderId);

// Tworzenie produktu w zamówieniu
router.post('/', verifyToken, verifyRole(['admin','managing director']), orderProductsController.createOrderProduct);

router.get('/user/:userId', verifyToken, orderProductsController.getOrderProductsByUserId);


module.exports = router;
