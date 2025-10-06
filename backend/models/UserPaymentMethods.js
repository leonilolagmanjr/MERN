const mongoose = require('mongoose');
const crypto = require('crypto');

const userPaymentMethodsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['gcash', 'bank', 'card', 'paypal', 'maya'],
    required: true
  },
  // For GCash
  gcashNumber: {
    type: String,
    required: function() { return this.type === 'gcash'; }
  },
  // For Bank
  bankName: {
    type: String,
    required: function() { return this.type === 'bank'; }
  },
  accountNumber: {
    type: String,
    required: function() { return this.type === 'bank'; }
  },
  // For Card (tokenized)
  stripeToken: {
    type: String,
    required: function() { return this.type === 'card'; }
  },
  last4: {
    type: String,
    required: function() { return this.type === 'card'; }
  },
  brand: {
    type: String,
    required: function() { return this.type === 'card'; }
  },
  // Encrypted sensitive data
  encryptedData: {
    type: String // For any additional encrypted info
  },
  isVerified: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Encrypt sensitive data before saving
userPaymentMethodsSchema.pre('save', function(next) {
  if (this.isModified('encryptedData') && this.encryptedData) {
    const algorithm = 'aes-256-cbc';
    const key = crypto.scryptSync(process.env.ENCRYPTION_KEY || 'defaultkey', 'salt', 32);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher(algorithm, key);
    let encrypted = cipher.update(this.encryptedData, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    this.encryptedData = iv.toString('hex') + ':' + encrypted;
  }
  next();
});

// Decrypt method
userPaymentMethodsSchema.methods.decryptData = function() {
  if (!this.encryptedData) return null;
  const algorithm = 'aes-256-cbc';
  const key = crypto.scryptSync(process.env.ENCRYPTION_KEY || 'defaultkey', 'salt', 32);
  const parts = this.encryptedData.split(':');
  const iv = Buffer.from(parts.shift(), 'hex');
  const encryptedText = Buffer.from(parts.join(':'), 'hex');
  const decipher = crypto.createDecipher(algorithm, key);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

module.exports = mongoose.model('UserPaymentMethods', userPaymentMethodsSchema);
