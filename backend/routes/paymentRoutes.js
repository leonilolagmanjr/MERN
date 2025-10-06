const express = require('express');
const authenticate = require('../middleware/authenticate');
const paymentController = require('../controllers/paymentController');

const router = express.Router();

router.post('/add', authenticate(), paymentController.addPaymentMethod);
router.get('/', authenticate(), paymentController.getPaymentMethods);
router.delete('/:id', authenticate(), paymentController.deletePaymentMethod);

module.exports = router;
