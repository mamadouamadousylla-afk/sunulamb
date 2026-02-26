const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Return public profile
const getPublicProfile = function(userData) {
  return {
    id: userData._id || userData.id,
    name: userData.name,
    email: userData.email,
    phone: userData.phone,
    points: userData.points,
    level: userData.level,
    role: userData.role
  };
};

// Get signed JWT token
const getSignedJwtToken = function(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'verylongsecretkeythatshouldbechangedinproduction', {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

// Match user entered password to hashed password
const matchPassword = async function(enteredPassword, hashedPassword) {
  return await bcrypt.compare(enteredPassword, hashedPassword);
};

// Generate password reset token
const getResetPasswordToken = function() {
  // Generate token
  const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

  // Hash token and set to resetPasswordToken field
  const hashedToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire (10 minutes)
  const expireTime = Date.now() + 10 * 60 * 1000;

  return {
    resetToken,
    hashedToken,
    expireTime
  };
};

module.exports = {
  findById: (id) => db.User.findById(id),
  findByEmail: (email) => db.User.findByEmail(email),
  findAll: () => db.User.findAll(),
  create: async (userData) => {
    // Hash password if provided
    if (userData.password) {
      const salt = await bcrypt.genSalt(10);
      userData.password = await bcrypt.hash(userData.password, salt);
    }
    
    return db.User.create(userData);
  },
  updateById: (id, updateData) => db.User.updateById(id, updateData),
  deleteById: (id) => db.User.deleteById(id),
  getPublicProfile,
  getSignedJwtToken,
  matchPassword,
  getResetPasswordToken
};