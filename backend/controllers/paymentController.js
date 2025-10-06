const UserPaymentMethods = require('../models/UserPaymentMethods');
const paymentService = require('../services/paymentService');

const addPaymentMethod = async (req, res) => {
  try {
    const { type, ...details } = req.body;
    const userId = req.user.id;

    let paymentMethodData = { user: userId, type };

    if (type === 'card') {
      const token = await paymentService.createStripeToken(details);
      paymentMethodData.stripeToken = token.id;
      paymentMethodData.last4 = token.card.last4;
      paymentMethodData.brand = token.card.brand;
    } else if (type === 'gcash') {
      paymentMethodData.gcashNumber = details.gcashNumber;
    } else if (type === 'bank') {
      paymentMethodData.bankName = details.bankName;
      paymentMethodData.accountNumber = details.accountNumber;
    }

    const paymentMethod = new UserPaymentMethods(paymentMethodData);
    await paymentMethod.save();

    res.status(201).json({ message: 'Payment method added', paymentMethod });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPaymentMethods = async (req, res) => {
  try {
    const userId = req.user.id;
    const methods = await UserPaymentMethods.find({ user: userId });
    res.json(methods);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deletePaymentMethod = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    await UserPaymentMethods.findOneAndDelete({ _id: id, user: userId });
    res.json({ message: 'Payment method deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addPaymentMethod,
  getPaymentMethods,
  deletePaymentMethod,
};
