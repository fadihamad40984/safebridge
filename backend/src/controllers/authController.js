const User = require('../models/User');
const { generateParentCode, sendTokenResponse } = require('../utils/auth');
const { sendPasswordResetEmail } = require('../utils/email');
const crypto = require('crypto');

/**
 * @desc    Register new child
 * @route   POST /api/auth/register/child
 * @access  Public
 */
exports.registerChild = async (req, res, next) => {
  try {
    const { name, email, age, password } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered',
      });
    }

    // Generate unique parent code
    let parentCode;
    let isUnique = false;
    
    while (!isUnique) {
      parentCode = generateParentCode();
      const existing = await User.findOne({ parentCode });
      if (!existing) {
        isUnique = true;
      }
    }

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      age,
      password,
      role: 'child',
      parentCode,
      linkedChildren: [],
    });

    // Send response with token
    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Register new parent
 * @route   POST /api/auth/register/parent
 * @access  Public
 */
exports.registerParent = async (req, res, next) => {
  try {
    const { name, email, password, childCode } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered',
      });
    }

    // Find child using childCode
    const child = await User.findOne({ parentCode: childCode, role: 'child' });

    if (!child) {
      return res.status(404).json({
        success: false,
        message: 'كود الطفل غير صحيح',
      });
    }

    // Create parent user with linked child
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: 'parent',
      linkedChildren: [child._id],
    });

    // Send response with token
    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Login
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate email and password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Find user with password
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Verify password
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Send response with token
    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current user
 * @route   GET /api/auth/me
 * @access  Private
 */
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Link additional child to parent account
 * @route   POST /api/auth/link-child
 * @access  Private (Parent only)
 */
exports.linkChild = async (req, res, next) => {
  try {
    const { childCode } = req.body;

    // Ensure user is a parent
    if (req.user.role !== 'parent') {
      return res.status(403).json({
        success: false,
        message: 'Only parents can link children',
      });
    }

    // Find child using childCode
    const child = await User.findOne({ parentCode: childCode, role: 'child' });

    if (!child) {
      return res.status(404).json({
        success: false,
        message: 'كود الطفل غير صحيح',
      });
    }

    // Get parent user
    const parent = await User.findById(req.user.id);

    // Check if child is already linked
    if (parent.linkedChildren.includes(child._id)) {
      return res.status(400).json({
        success: false,
        message: 'This child is already linked to your account',
      });
    }

    // Add child to parent's linkedChildren array
    parent.linkedChildren.push(child._id);
    await parent.save();

    res.status(200).json({
      success: true,
      message: 'Child linked successfully',
      linkedChildren: parent.linkedChildren,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get linked children details
 * @route   GET /api/auth/linked-children
 * @access  Private (Parent only)
 */
exports.getLinkedChildren = async (req, res, next) => {
  try {
    // Ensure user is a parent
    if (req.user.role !== 'parent') {
      return res.status(403).json({
        success: false,
        message: 'Only parents can access this endpoint',
      });
    }

    const parent = await User.findById(req.user.id).populate('linkedChildren', 'name age email');

    res.status(200).json({
      success: true,
      children: parent.linkedChildren || [],
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Forgot password - send reset email
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email address',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email address',
      });
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    try {
      await sendPasswordResetEmail(user, resetToken);

      res.status(200).json({
        success: true,
        message: 'Password reset email sent successfully',
      });
    } catch (error) {
      console.error('Email sending error:', error);
      
      // Reset token fields if email fails
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({
        success: false,
        message: 'Failed to send password reset email. Please try again later.',
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Reset password
 * @route   POST /api/auth/reset-password/:token
 * @access  Public
 */
exports.resetPassword = async (req, res, next) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a new password',
      });
    }

    // Hash token from URL
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    // Find user with valid token
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token',
      });
    }

    // Set new password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    // Send token response (log user in)
    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if email is being changed and if it already exists
    if (email && email.toLowerCase() !== user.email) {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email already in use',
        });
      }
      user.email = email.toLowerCase();
    }

    // Update name if provided
    if (name) {
      user.name = name;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        age: user.age,
        parentCode: user.parentCode,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Change password
 * @route   PUT /api/auth/change-password
 * @access  Private
 */
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current password and new password',
      });
    }

    // Get user with password
    const user = await User.findById(req.user.id).select('+password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Verify current password
    const isMatch = await user.matchPassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    // Set new password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    next(error);
  }
};
