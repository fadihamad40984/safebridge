const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validator');
const {
  addMoodEntry,
  getLastWeek,
  canLogToday,
  getChildEntries,
  getWeeklySummary,
  getAllEntries,
  getChildReference,
} = require('../controllers/moodController');
const { protect, childOnly, parentOnly } = require('../middleware/auth');

const router = express.Router();

// مسارات الطفل
router.post(
  '/',
  protect,
  childOnly,
  [
    body('mood')
      .isInt({ min: 1, max: 5 })
      .withMessage('مستوى المزاج يجب أن يكون بين 1 و 5'),
    body('note')
      .optional()
      .isLength({ max: 500 })
      .withMessage('الملاحظة يجب ألا تتجاوز 500 حرف'),
  ],
  validate,
  addMoodEntry
);

router.get('/last-week', protect, childOnly, getLastWeek);
router.get('/can-log-today', protect, childOnly, canLogToday);
router.get('/reference', protect, childOnly, getChildReference);

// مسارات ولي الأمر
router.get('/child-entries', protect, parentOnly, getChildEntries);
router.get('/weekly-summary', protect, parentOnly, getWeeklySummary);
router.get('/all-entries', protect, parentOnly, getAllEntries);

module.exports = router;
