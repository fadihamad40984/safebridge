const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validator');
const {
  registerChild,
  registerParent,
  login,
  getMe,
  linkChild,
  getLinkedChildren,
  forgotPassword,
  resetPassword,
  updateProfile,
  changePassword,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// تسجيل طفل جديد
router.post(
  '/register/child',
  [
    body('name')
      .notEmpty().withMessage('الاسم مطلوب')
      .isLength({ min: 2, max: 100 }).withMessage('الاسم يجب أن يكون بين 2 و 100 حرف')
      .trim(),
    body('email')
      .notEmpty().withMessage('البريد الإلكتروني مطلوب')
      .isEmail().withMessage('الرجاء إدخال بريد إلكتروني صحيح')
      .normalizeEmail(),
    body('age')
      .isInt({ min: 3, max: 17 })
      .withMessage('العمر يجب أن يكون بين 3 و 17 سنة'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
  ],
  validate,
  registerChild
);

// تسجيل ولي أمر جديد
router.post(
  '/register/parent',
  [
    body('name')
      .notEmpty().withMessage('الاسم مطلوب')
      .isLength({ min: 2, max: 100 }).withMessage('الاسم يجب أن يكون بين 2 و 100 حرف')
      .trim(),
    body('email')
      .notEmpty().withMessage('البريد الإلكتروني مطلوب')
      .isEmail().withMessage('الرجاء إدخال بريد إلكتروني صحيح')
      .normalizeEmail(),
    body('password')
      .isLength({ min: 6 })
      .withMessage('كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
    body('childCode')
      .notEmpty()
      .withMessage('كود الطفل مطلوب')
      .isLength({ min: 8, max: 8 })
      .withMessage('كود الطفل يجب أن يكون 8 أحرف'),
  ],
  validate,
  registerParent
);

// تسجيل الدخول
router.post(
  '/login',
  [
    body('email')
      .notEmpty().withMessage('البريد الإلكتروني مطلوب')
      .isEmail().withMessage('الرجاء إدخال بريد إلكتروني صحيح')
      .normalizeEmail(),
    body('password')
      .notEmpty().withMessage('كلمة المرور مطلوبة'),
  ],
  validate,
  login
);

// ربط طفل إضافي بحساب ولي الأمر
router.post(
  '/link-child',
  protect,
  [
    body('childCode')
      .notEmpty()
      .withMessage('كود الطفل مطلوب')
      .isLength({ min: 8, max: 8 })
      .withMessage('كود الطفل يجب أن يكون 8 أحرف'),
  ],
  validate,
  linkChild
);

// الحصول على المستخدم الحالي
router.get('/me', protect, getMe);

// الحصول على قائمة الأطفال المرتبطين (للآباء فقط)
router.get('/linked-children', protect, getLinkedChildren);

// نسيت كلمة المرور - إرسال بريد إعادة تعيين
router.post(
  '/forgot-password',
  [
    body('email')
      .notEmpty().withMessage('البريد الإلكتروني مطلوب')
      .isEmail().withMessage('الرجاء إدخال بريد إلكتروني صحيح')
      .normalizeEmail(),
  ],
  validate,
  forgotPassword
);

// إعادة تعيين كلمة المرور
router.post(
  '/reset-password/:token',
  [
    body('password')
      .isLength({ min: 6 })
      .withMessage('كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
  ],
  validate,
  resetPassword
);

// تحديث الملف الشخصي
router.put(
  '/profile',
  protect,
  [
    body('name')
      .optional()
      .isLength({ min: 2, max: 100 })
      .withMessage('الاسم يجب أن يكون بين 2 و 100 حرف')
      .trim(),
    body('email')
      .optional()
      .isEmail()
      .withMessage('الرجاء إدخال بريد إلكتروني صحيح')
      .normalizeEmail(),
  ],
  validate,
  updateProfile
);

// تغيير كلمة المرور
router.put(
  '/change-password',
  protect,
  [
    body('currentPassword')
      .notEmpty()
      .withMessage('كلمة المرور الحالية مطلوبة'),
    body('newPassword')
      .isLength({ min: 6 })
      .withMessage('كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل'),
  ],
  validate,
  changePassword
);

module.exports = router;
