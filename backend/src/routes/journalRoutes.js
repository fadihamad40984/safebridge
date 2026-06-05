const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createEntry,
  getEntries,
  getEntry,
  deleteEntry,
  updateEntry,
  getStats,
} = require('../controllers/journalController');

// جميع المسارات تحتاج authentication
router.use(protect);

// @route   POST /api/journal
// @desc    إضافة يومية جديدة
// @access  Private
router.post('/', createEntry);

// @route   GET /api/journal
// @desc    جلب جميع اليوميات
// @access  Private
router.get('/', getEntries);

// @route   GET /api/journal/stats
// @desc    جلب إحصائيات اليوميات
// @access  Private
router.get('/stats', getStats);

// @route   GET /api/journal/:id
// @desc    جلب يومية واحدة
// @access  Private
router.get('/:id', getEntry);

// @route   PUT /api/journal/:id
// @desc    تحديث يومية
// @access  Private
router.put('/:id', updateEntry);

// @route   DELETE /api/journal/:id
// @desc    حذف يومية
// @access  Private
router.delete('/:id', deleteEntry);

module.exports = router;
