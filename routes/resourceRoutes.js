const express = require('express');
const {
  fetchResources,
  fetchResourceById,
  addResource,
  updateResourceById,
  removeResource,
} = require('../controllers/resourceController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', fetchResources);
router.get('/:id', fetchResourceById);
router.post('/', authenticateToken, authorizeRole('admin'), addResource);
router.put('/:id', authenticateToken, authorizeRole('admin'), updateResourceById);
router.delete('/:id', authenticateToken, authorizeRole('admin'), removeResource);

module.exports = router;
