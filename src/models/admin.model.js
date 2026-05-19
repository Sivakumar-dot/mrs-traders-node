const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema(
  {
    adminId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: null
    },
    mobile: {
      type: String,
      trim: true,
      default: null
    },
    role: {
      type: String,
      default: 'SUPER_ADMIN'
    },
    password: {
      type: String,
      default: null
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = mongoose.model('Admin', adminSchema);
