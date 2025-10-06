const express = require('express');
const authenticate = require('../middleware/authenticate');
const verificationController = require('../controllers/verificationController');
const multer = require('multer');

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/verification/',
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    // Allow only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Protected routes (require authentication)
router.post('/initiate', authenticate(), verificationController.initiateVerification);
router.post('/upload-document', authenticate(), upload.single('document'), verificationController.uploadDocument);
router.get('/status', authenticate(), verificationController.checkVerificationStatus);
router.get('/info', authenticate(), verificationController.getVerificationInfo);

// Webhook routes (public, but should be secured with API keys in production)
router.post('/webhooks/jumio', express.raw({ type: 'application/json' }), verificationController.handleJumioWebhook);
router.post('/webhooks/onfido', express.json(), verificationController.handleOnfidoWebhook);
router.post('/webhooks/stripe-identity', express.raw({ type: 'application/json' }), verificationController.handleStripeIdentityWebhook);

module.exports = router;
