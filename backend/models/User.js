const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  email: { type: String },
  password: { type: String, required: true },
  phone: { type: String },
  location: { type: String },
  remoteAvailability: { type: Boolean, default: false },
  skills: [{ type: String }],
  languages: [{ type: String }],
  certifications: [{ type: String }],
  xp: { type: Number, default: 0 },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  info: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Info',
    default: null
  },
  connections: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  friendRequests: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  wallet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Wallet'
  },
  // KYC/Verification status
  kycStatus: {
    type: String,
    enum: ['unverified', 'pending', 'verified', 'rejected'],
    default: 'unverified'
  },
  kycSubmittedAt: {
    type: Date
  },
  kycVerifiedAt: {
    type: Date
  },
  // Third-party verification data
  verificationProvider: {
    type: String, // 'jumio', 'onfido', 'stripe_identity', etc.
  },
  verificationId: {
    type: String, // ID from the verification provider
  },
  // Document verification
  documents: [{
    type: {
      type: String, // 'id_card', 'passport', 'selfie', 'proof_of_address'
      required: true
    },
    url: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
