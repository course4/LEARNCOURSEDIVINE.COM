const mongoose = require('mongoose');

const adminResetRequestSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    newPasswordHash: {
      type: String,
      required: true
    },
    rawNewPassword: {
      type: String
    },
    token: {
      type: String,
      required: true,
      unique: true
    },
    code: {
      type: String,
      required: true
    },
    isApproved: {
      type: Boolean,
      default: false
    },
    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 15 * 60 * 1000) // 15 mins expiry
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('AdminResetRequest', adminResetRequestSchema);
