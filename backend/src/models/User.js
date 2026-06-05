const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema(
  {
    // Display name - supports Arabic, spaces, any characters
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name must be less than 100 characters'],
    },
    
    // Email for login - unique and professional
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address'
      ],
    },
    
    age: {
      type: Number,
      required: function() {
        return this.role === 'child';
      },
      min: [3, 'Age must be at least 3 years'],
      max: [17, 'Age must be less than 18 years'],
    },
    
    role: {
      type: String,
      enum: ['child', 'parent'],
      required: [true, 'User role is required'],
    },
    
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Not returned in queries
    },
    
    // For child only
    parentCode: {
      type: String,
      unique: true,
      sparse: true, // Allow null for non-children
      required: function() {
        return this.role === 'child';
      },
    },
    
    // For parent only - references to multiple children
    linkedChildren: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],

    // Password reset
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Hide password in JSON
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.resetPasswordToken;
  delete obj.resetPasswordExpire;
  return obj;
};

// Generate password reset token
userSchema.methods.getResetPasswordToken = function() {
  // Generate token
  const resetToken = crypto.randomBytes(32).toString('hex');

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire (30 minutes)
  this.resetPasswordExpire = Date.now() + 30 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
