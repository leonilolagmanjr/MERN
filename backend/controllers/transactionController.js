const transactionService = require('../services/transactionService');

const deposit = async (req, res) => {
  try {
    const { amount, currency, paymentMethodId } = req.body;
    const userId = req.user.id;
    const transaction = await transactionService.processDeposit(userId, amount, currency, paymentMethodId);
    res.json({ message: 'Deposit processed', transaction });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const withdraw = async (req, res) => {
  try {
    const { amount, currency, paymentMethodId } = req.body;
    const userId = req.user.id;
    const transaction = await transactionService.processWithdrawal(userId, amount, currency, paymentMethodId);
    res.json({ message: 'Withdrawal processed', transaction });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const trade = async (req, res) => {
  try {
    const { recipientId, amount, currency } = req.body;
    const userId = req.user.id;
    const transaction = await transactionService.processTrade(userId, recipientId, amount, currency);
    res.json({ message: 'Trade processed', transaction });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTransactions = async (req, res) => {
  try {
    const userId = req.user.id;
    const transactions = await transactionService.getTransactionHistory(userId);
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getWallet = async (req, res) => {
  try {
    const userId = req.user.id;
    const balances = await transactionService.getWalletBalance(userId);
    res.json(balances);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Webhook for transaction confirmations
const handleWebhook = async (req, res) => {
  try {
    const event = req.body;

    // Verify webhook signature if needed (Stripe example)
    // const sig = req.headers['stripe-signature'];
    // const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    // const verifiedEvent = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);

    if (event.type === 'charge.succeeded' || event.type === 'payment_intent.succeeded') {
      // Update transaction status to completed
      const txnId = event.data.object.metadata.txnId;
      await transactionService.updateTransactionStatus(txnId, 'completed');
    } else if (event.type === 'charge.failed' || event.type === 'payment_intent.payment_failed') {
      const txnId = event.data.object.metadata.txnId;
      await transactionService.updateTransactionStatus(txnId, 'failed');
    }

    // For PayMongo, similar logic
    // if (event.data.attributes.status === 'paid') { ... }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({ error: 'Webhook error' });
  }
};

module.exports = {
  deposit,
  withdraw,
  trade,
  getTransactions,
  getWallet,
  handleWebhook,
};
