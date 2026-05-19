const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roles');
const verifyToken = require('../middleware/authMiddleware');
const verifyRole = require('../middleware/roleMiddleware');

router.get('/', verifyToken, verifyRole(['admin']), roleController.getRoles);
router.get('/:id', verifyToken, verifyRole(['admin']), roleController.getRoleById);

module.exports = router;
