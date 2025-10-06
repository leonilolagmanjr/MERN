const express = require('express');
const authenticate = require('../middleware/authenticate');
const transactionController = require('../controllers/transactionController');

const router = express.Router();

router.post('/deposit', authenticate(), transactionController.deposit);
router.post('/withdraw', authenticate(), transactionController.withdraw);
router.post('/trade', authenticate(), transactionController.trade);
router.get('/', authenticate(), transactionController.getTransactions);
router.get('/wallet', authenticate(), transactionController.getWallet);
router.post('/webhook', transactionController.handleWebhook); // No auth for webhooks

module.exports = router;
