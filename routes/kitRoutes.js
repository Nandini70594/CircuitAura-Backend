const express = require('express');
const { fetchKits, fetchKitById, addKit, updateKitById, removeKit } = require('../controllers/kitController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', fetchKits);
router.get('/:id', fetchKitById);
router.post('/', authenticateToken, authorizeRole('admin'), addKit);
router.put('/:id', authenticateToken, authorizeRole('admin'), updateKitById);
router.delete('/:id', authenticateToken, authorizeRole('admin'), removeKit);

module.exports = router;
