const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const verifyToken = require('../middleware/authMiddleware');
const verifyRole = require('../middleware/roleMiddleware');

// Endpointy dla produktów
router.post('/', verifyToken, verifyRole(['admin', 'managing director']), productController.createProduct); // Dodawanie produktu
router.get('/', verifyToken, verifyRole(['worker', 'managing director', 'admin']), productController.getAllProducts); // Z paginacją
router.get('/search', verifyToken, verifyRole(['worker', 'managing director', 'admin']), productController.searchAndAutocompleteProducts); // Wyszukiwanie i autouzupełnianie
router.get('/:id', verifyToken, verifyRole(['worker', 'managing director', 'admin']), productController.getProductById); // Pobieranie szczegółów produktu
router.put('/:id', verifyToken, verifyRole(['admin', 'managing director']), productController.updateProduct); // Aktualizacja produktu
router.delete('/:id', verifyToken, verifyRole(['admin', 'managing director']), productController.deleteProduct); // Usuwanie produktu

module.exports = router;
