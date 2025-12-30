const express = require('express');
const { fetchProducts, fetchProductById, addProduct, updateProductById, removeProduct } = require('../controllers/productController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', fetchProducts);
router.get('/:id', fetchProductById);
router.post('/', authenticateToken, authorizeRole('admin'), addProduct);
router.put('/:id', authenticateToken, authorizeRole('admin'), updateProductById);
router.delete('/:id', authenticateToken, authorizeRole('admin'), removeProduct);

module.exports = router;
