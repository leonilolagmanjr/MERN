const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_...'); // Use test key
const axios = require('axios');
const crypto = require('crypto');

// For GCash via PayMongo (requires API key)
const paymongoSecret = process.env.PAYMONGO_SECRET_KEY || 'sk_test_...';

// Dragonpay configuration
const dragonpayMerchantId = process.env.DRAGONPAY_MERCHANT_ID || 'MERCHANT123';
const dragonpaySecret = process.env.DRAGONPAY_SECRET || 'secret123';

// PayPal configuration
const paypalClientId = process.env.PAYPAL_CLIENT_ID || 'client_id';
const paypalClientSecret = process.env.PAYPAL_CLIENT_SECRET || 'client_secret';

class PaymentService {
  // Stripe for cards
  async createStripeToken(cardDetails) {
    try {
      const token = await stripe.tokens.create({
        card: {
          number: cardDetails.number,
          exp_month: cardDetails.expMonth,
          exp_year: cardDetails.expYear,
          cvc: cardDetails.cvc,
        },
      });
      return token;
    } catch (error) {
      throw new Error('Failed to create Stripe token: ' + error.message);
    }
  }

  async chargeStripe(amount, token, currency = 'php') {
    try {
      const charge = await stripe.charges.create({
        amount: amount * 100, // Stripe uses cents
        currency,
        source: token,
        description: 'Payment',
      });
      return charge;
    } catch (error) {
      throw new Error('Stripe charge failed: ' + error.message);
    }
  }

  // GCash via PayMongo
  async createGCashPayment(amount, gcashNumber) {
    try {
      const response = await axios.post('https://api.paymongo.com/v1/sources', {
        data: {
          attributes: {
            amount: amount * 100,
            currency: 'PHP',
            type: 'gcash',
            redirect: {
              success: `${process.env.FRONTEND_URL}/payment/success`,
              failed: `${process.env.FRONTEND_URL}/payment/failed`,
            },
          },
        },
      }, {
        headers: {
          'Authorization': `Basic ${Buffer.from(paymongoSecret + ':').toString('base64')}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data.data;
    } catch (error) {
      throw new Error('GCash payment creation failed: ' + error.message);
    }
  }

  // Dragonpay for bank transfers
  async initiateDragonpayPayment(amount, currency = 'PHP', description = 'Payment') {
    try {
      const txnId = 'DP' + Date.now();
      const digest = crypto.createHash('sha1')
        .update(dragonpayMerchantId + ':' + txnId + ':' + amount + ':' + currency + ':' + description + ':' + dragonpaySecret)
        .digest('hex');

      const params = new URLSearchParams({
        merchantid: dragonpayMerchantId,
        txnid: txnId,
        amount: amount,
        ccy: currency,
        description: description,
        digest: digest,
        email: 'user@example.com', // Would come from user data
      });

      return {
        txnId,
        paymentUrl: `https://test.dragonpay.ph/Pay.aspx?${params.toString()}`,
        status: 'pending',
      };
    } catch (error) {
      throw new Error('Dragonpay payment initiation failed: ' + error.message);
    }
  }

  // PayPal integration
  async createPayPalOrder(amount, currency = 'PHP') {
    try {
      // Get access token
      const auth = Buffer.from(`${paypalClientId}:${paypalClientSecret}`).toString('base64');
      const tokenResponse = await axios.post('https://api-m.sandbox.paypal.com/v1/oauth2/token', 'grant_type=client_credentials', {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const accessToken = tokenResponse.data.access_token;

      // Create order
      const orderResponse = await axios.post('https://api-m.sandbox.paypal.com/v2/checkout/orders', {
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: currency,
            value: amount.toString(),
          },
        }],
        application_context: {
          return_url: `${process.env.FRONTEND_URL}/payment/success`,
          cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
        },
      }, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      return {
        orderId: orderResponse.data.id,
        approvalUrl: orderResponse.data.links.find(link => link.rel === 'approve').href,
        status: 'pending',
      };
    } catch (error) {
      throw new Error('PayPal order creation failed: ' + error.message);
    }
  }

  async capturePayPalOrder(orderId) {
    try {
      // Get access token
      const auth = Buffer.from(`${paypalClientId}:${paypalClientSecret}`).toString('base64');
      const tokenResponse = await axios.post('https://api-m.sandbox.paypal.com/v1/oauth2/token', 'grant_type=client_credentials', {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const accessToken = tokenResponse.data.access_token;

      // Capture order
      const captureResponse = await axios.post(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}/capture`, {}, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      return captureResponse.data;
    } catch (error) {
      throw new Error('PayPal capture failed: ' + error.message);
    }
  }

  // Maya (formerly PayMaya) integration
  async createMayaPayment(amount, phoneNumber) {
    try {
      const response = await axios.post('https://pg-sandbox.paymaya.com/payby/v2/paymaya/payments', {
        totalAmount: {
          value: amount,
          currency: 'PHP',
        },
        buyer: {
          contact: {
            phone: phoneNumber,
          },
        },
        redirectUrl: {
          success: `${process.env.FRONTEND_URL}/payment/success`,
          failure: `${process.env.FRONTEND_URL}/payment/failed`,
          cancel: `${process.env.FRONTEND_URL}/payment/cancel`,
        },
        requestReferenceNumber: 'PAY' + Date.now(),
      }, {
        headers: {
          'Authorization': `Basic ${Buffer.from(process.env.MAYA_PUBLIC_KEY + ':').toString('base64')}`,
          'Content-Type': 'application/json',
        },
      });

      return {
        paymentId: response.data.paymentId,
        checkoutUrl: response.data.redirectUrl,
        status: 'pending',
      };
    } catch (error) {
      throw new Error('Maya payment creation failed: ' + error.message);
    }
  }

  // Verify payment status
  async checkPaymentStatus(gatewayTxnId, type) {
    if (type === 'stripe') {
      const charge = await stripe.charges.retrieve(gatewayTxnId);
      return charge.status;
    } else if (type === 'gcash') {
      // PayMongo check
      const response = await axios.get(`https://api.paymongo.com/v1/payments/${gatewayTxnId}`, {
        headers: {
          'Authorization': `Basic ${Buffer.from(paymongoSecret + ':').toString('base64')}`,
        },
      });
      return response.data.data.attributes.status;
    }
    return 'unknown';
  }
}

module.exports = new PaymentService();
