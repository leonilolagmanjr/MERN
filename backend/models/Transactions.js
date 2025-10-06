const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['deposit', 'withdrawal', 'trade', 'fee'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'PHP' // Support multiple currencies
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled'],
    default: 'pending'
  },
  paymentMethod: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserPaymentMethods'
  },
  // For trades
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  // Gateway transaction ID
  gatewayTxnId: {
    type: String
  },
  // Description
  description: {
    type: String
  },
  // Fees
  fee: {
    type: Number,
    default: 0
  },
  // Metadata for additional info
  metadata: {
    type: mongoose.Schema.Types.Mixed
  }
}, { timestamps: true });

module.exports = mongoose.model('Transactions', transactionSchema);
