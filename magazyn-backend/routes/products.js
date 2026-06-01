const express = require('express');
const router = express.Router();

const productController = require('../controllers/productController');

const verifyToken = require('../middleware/authMiddleware');
const verifyRole = require('../middleware/roleMiddleware');
const validate = require('../middleware/validate');

const {
  createProductSchema,
  updateProductSchema,
} = require('../validators/productValidator');

// Dodawanie produktu
router.post(
  '/',
  verifyToken,
  verifyRole(['admin', 'managing director']),
  validate(createProductSchema),
  productController.createProduct
);

// Pobieranie wszystkich produktów
router.get(
  '/',
  verifyToken,
  verifyRole(['worker', 'managing director', 'admin']),
  productController.getAllProducts
);

// Wyszukiwanie i autouzupełnianie
router.get(
  '/search',
  verifyToken,
  verifyRole(['worker', 'managing director', 'admin']),
  productController.searchAndAutocompleteProducts
);

// Pobieranie szczegółów produktu
router.get(
  '/:id',
  verifyToken,
  verifyRole(['worker', 'managing director', 'admin']),
  productController.getProductById
);

// Aktualizacja produktu
router.put(
  '/:id',
  verifyToken,
  verifyRole(['admin', 'managing director']),
  validate(updateProductSchema),
  productController.updateProduct
);

// Usuwanie produktu
router.delete(
  '/:id',
  verifyToken,
  verifyRole(['admin', 'managing director']),
  productController.deleteProduct
);

module.exports = router;