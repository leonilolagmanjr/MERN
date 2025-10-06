const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  balances: {
    type: Map,
    of: Number,
    default: () => new Map([['PHP', 0], ['USD', 0], ['BTC', 0]]) // Default currencies
  },
  totalValue: {
    type: Number,
    default: 0 // In USD or base currency
  }
}, { timestamps: true });

// Method to update balance
walletSchema.methods.updateBalance = function(currency, amount) {
  const current = this.balances.get(currency) || 0;
  this.balances.set(currency, current + amount);
  // Recalculate total value (simplified, assume 1:1 for now)
  this.totalValue = Array.from(this.balances.values()).reduce((sum, val) => sum + val, 0);
};

module.exports = mongoose.model('Wallet', walletSchema);
