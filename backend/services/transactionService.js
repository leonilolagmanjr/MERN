const Transactions = require('../models/Transactions');
const Wallet = require('../models/Wallet');
const User = require('../models/User');
const paymentService = require('./paymentService');

class TransactionService {
  async createTransaction(userId, type, amount, currency, paymentMethodId, recipientId = null, description = '') {
    const transaction = new Transactions({
      user: userId,
      type,
      amount,
      currency,
      paymentMethod: paymentMethodId,
      recipient: recipientId,
      description,
    });
    await transaction.save();
    return transaction;
  }

  async processDeposit(userId, amount, currency, paymentMethodId) {
    // Check KYC compliance before processing
    const verificationService = require('./verificationService');
    const complianceCheck = await verificationService.checkTransactionCompliance(userId, amount, currency);

    if (!complianceCheck.allowed) {
      throw new Error(complianceCheck.reason);
    }

    const transaction = await this.createTransaction(userId, 'deposit', amount, currency, paymentMethodId, null, 'Deposit via payment method');

    try {
      // Process via gateway
      const paymentMethod = await require('../models/UserPaymentMethods').findById(paymentMethodId);
      let gatewayTxnId;

      if (paymentMethod.type === 'card') {
        const charge = await paymentService.chargeStripe(amount, paymentMethod.stripeToken, currency.toLowerCase());
        gatewayTxnId = charge.id;
      } else if (paymentMethod.type === 'gcash') {
        const gcashPayment = await paymentService.createGCashPayment(amount, paymentMethod.gcashNumber);
        gatewayTxnId = gcashPayment.id;
      } else if (paymentMethod.type === 'bank') {
        const dragonpayTxn = await paymentService.initiateDragonpayPayment(amount, currency, 'Deposit via bank transfer');
        gatewayTxnId = dragonpayTxn.txnId;
      } else if (paymentMethod.type === 'paypal') {
        const paypalOrder = await paymentService.createPayPalOrder(amount, currency);
        gatewayTxnId = paypalOrder.orderId;
      } else if (paymentMethod.type === 'maya') {
        const mayaPayment = await paymentService.createMayaPayment(amount, paymentMethod.mayaNumber || paymentMethod.gcashNumber);
        gatewayTxnId = mayaPayment.paymentId;
      }

      transaction.gatewayTxnId = gatewayTxnId;
      transaction.status = 'completed';
      await transaction.save();

      // Update wallet
      let wallet = await Wallet.findOne({ user: userId });
      if (!wallet) {
        wallet = new Wallet({ user: userId });
      }
      wallet.updateBalance(currency, amount);
      await wallet.save();

      // Update user wallet ref if not set
      const user = await User.findById(userId);
      if (!user.wallet) {
        user.wallet = wallet._id;
        await user.save();
      }

      return transaction;
    } catch (error) {
      transaction.status = 'failed';
      await transaction.save();
      throw error;
    }
  }

  async processWithdrawal(userId, amount, currency, paymentMethodId) {
    // Check balance
    const wallet = await Wallet.findOne({ user: userId });
    if (!wallet || (wallet.balances.get(currency) || 0) < amount) {
      throw new Error('Insufficient balance');
    }

    const transaction = await this.createTransaction(userId, 'withdrawal', amount, currency, paymentMethodId, null, 'Withdrawal to payment method');

    try {
      // For simplicity, assume instant for demo
      transaction.status = 'completed';
      await transaction.save();

      // Deduct from wallet
      wallet.updateBalance(currency, -amount);
      await wallet.save();

      return transaction;
    } catch (error) {
      transaction.status = 'failed';
      await transaction.save();
      throw error;
    }
  }

  async processTrade(senderId, recipientId, amount, currency) {
    // Check sender balance
    const senderWallet = await Wallet.findOne({ user: senderId });
    if (!senderWallet || (senderWallet.balances.get(currency) || 0) < amount) {
      throw new Error('Insufficient balance for trade');
    }

    const transaction = await this.createTransaction(senderId, 'trade', amount, currency, null, recipientId, `Trade to user ${recipientId}`);

    try {
      // Deduct from sender
      senderWallet.updateBalance(currency, -amount);
      await senderWallet.save();

      // Add to recipient
      let recipientWallet = await Wallet.findOne({ user: recipientId });
      if (!recipientWallet) {
        recipientWallet = new Wallet({ user: recipientId });
      }
      recipientWallet.updateBalance(currency, amount);
      await recipientWallet.save();

      transaction.status = 'completed';
      await transaction.save();

      return transaction;
    } catch (error) {
      transaction.status = 'failed';
      await transaction.save();
      throw error;
    }
  }

  async getTransactionHistory(userId) {
    return await Transactions.find({ user: userId }).populate('paymentMethod').sort({ createdAt: -1 });
  }

  async getWalletBalance(userId) {
    const wallet = await Wallet.findOne({ user: userId });
    return wallet ? Object.fromEntries(wallet.balances) : {};
  }

  async updateTransactionStatus(txnId, status) {
    const transaction = await Transactions.findById(txnId);
    if (!transaction) {
      throw new Error('Transaction not found');
    }

    transaction.status = status;
    await transaction.save();

    // If completed and deposit, update wallet
    if (status === 'completed' && transaction.type === 'deposit') {
      let wallet = await Wallet.findOne({ user: transaction.user });
      if (!wallet) {
        wallet = new Wallet({ user: transaction.user });
      }
      wallet.updateBalance(transaction.currency, transaction.amount);
      await wallet.save();
    }

    return transaction;
  }
}

module.exports = new TransactionService();
