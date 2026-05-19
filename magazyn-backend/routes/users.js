const express = require('express');
const router = express.Router();
const userController = require('../controllers/users');
const verifyToken = require('../middleware/authMiddleware');
const verifyRole = require('../middleware/roleMiddleware');
const validate = require('../middleware/validate');
const { registerSchema, loginSchema } = require('../validators/userValidator');

// Rejestracja
router.post('/register', validate(registerSchema), userController.register);

// Logowanie
router.post('/login', validate(loginSchema), userController.login);

// Profil użytkownika
router.get('/profile', verifyToken, userController.getProfile);

// Lista użytkowników (z paginacją)
router.get('/', verifyToken, verifyRole(['admin']), userController.getUsersWithPagination);

// Szczegóły użytkownika
router.get('/:id', verifyToken, verifyRole(['admin']), userController.getUserById);

// Aktualizacja użytkownika
router.put('/:id', verifyToken, verifyRole(['admin']), userController.updateUser);

// Usuwanie użytkownika
router.delete('/:id', verifyToken, verifyRole(['admin']), userController.deleteUser);

module.exports = router;
