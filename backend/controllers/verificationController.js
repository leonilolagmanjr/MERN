const User = require('../models/User');
const verificationService = require('../services/verificationService');

class VerificationController {
  // Initiate KYC verification
  async initiateVerification(req, res) {
    try {
      const { provider, userData } = req.body;
      const userId = req.user.id;

      let verificationResult;

      switch (provider) {
        case 'jumio':
          verificationResult = await verificationService.initiateJumioVerification(userId, userData);
          break;
        case 'onfido':
          const applicant = await verificationService.createOnfidoApplicant(userData);
          verificationResult = await verificationService.createOnfidoCheck(applicant.applicantId, userData.document);
          verificationResult.applicantId = applicant.applicantId;
          break;
        case 'stripe_identity':
          verificationResult = await verificationService.createStripeIdentityVerification({ ...userData, userId });
          break;
        default:
          return res.status(400).json({ error: 'Unsupported verification provider' });
      }

      // Update user with verification details
      await User.findByIdAndUpdate(userId, {
        kycStatus: 'pending',
        kycSubmittedAt: new Date(),
        verificationProvider: provider,
        verificationId: verificationResult.verificationId || verificationResult.sessionId || verificationResult.checkId
      });

      res.json({
        success: true,
        verification: verificationResult
      });
    } catch (error) {
      console.error('Verification initiation error:', error);
      res.status(500).json({ error: 'Failed to initiate verification: ' + error.message });
    }
  }

  // Upload document for verification
  async uploadDocument(req, res) {
    try {
      const { documentType } = req.body;
      const userId = req.user.id;
      const file = req.file;

      if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      // Verify the document
      const verificationResult = await verificationService.verifyDocument(file.path, documentType);

      // Save document to user profile
      const document = {
        type: documentType,
        url: file.path,
        status: verificationResult.isValid ? 'approved' : 'rejected'
      };

      await User.findByIdAndUpdate(userId, {
        $push: { documents: document },
        kycStatus: verificationResult.isValid ? 'verified' : 'rejected',
        ...(verificationResult.isValid && { kycVerifiedAt: new Date() })
      });

      res.json({
        success: true,
        document,
        verification: verificationResult
      });
    } catch (error) {
      console.error('Document upload error:', error);
      res.status(500).json({ error: 'Failed to upload document: ' + error.message });
    }
  }

  // Check verification status
  async checkVerificationStatus(req, res) {
    try {
      const userId = req.user.id;
      const user = await User.findById(userId).select('kycStatus verificationProvider verificationId documents');

      if (!user.verificationId) {
        return res.json({ status: 'not_started' });
      }

      const statusResult = await verificationService.checkVerificationStatus(
        user.verificationId,
        user.verificationProvider
      );

      // Update user status if verification completed
      if (statusResult.status === 'completed' && statusResult.result === 'approved') {
        await User.findByIdAndUpdate(userId, {
          kycStatus: 'verified',
          kycVerifiedAt: new Date()
        });
      }

      res.json({
        status: statusResult.status,
        result: statusResult.result,
        documents: user.documents
      });
    } catch (error) {
      console.error('Status check error:', error);
      res.status(500).json({ error: 'Failed to check verification status: ' + error.message });
    }
  }

  // Webhook handlers for third-party providers
  async handleJumioWebhook(req, res) {
    try {
      const { jumioIdScanReference, verificationStatus } = req.body;

      // Find user by verification ID
      const user = await User.findOne({ verificationId: jumioIdScanReference });

      if (user) {
        const newStatus = verificationStatus === 'APPROVED' ? 'verified' : 'rejected';
        await User.findByIdAndUpdate(user._id, {
          kycStatus: newStatus,
          ...(newStatus === 'verified' && { kycVerifiedAt: new Date() })
        });
      }

      res.json({ success: true });
    } catch (error) {
      console.error('Jumio webhook error:', error);
      res.status(500).json({ error: 'Webhook processing failed' });
    }
  }

  async handleOnfidoWebhook(req, res) {
    try {
      const { object, data } = req.body;

      if (object === 'check' && data.status === 'complete') {
        const user = await User.findOne({ verificationId: data.id });

        if (user) {
          const newStatus = data.result === 'clear' ? 'verified' : 'rejected';
          await User.findByIdAndUpdate(user._id, {
            kycStatus: newStatus,
            ...(newStatus === 'verified' && { kycVerifiedAt: new Date() })
          });
        }
      }

      res.json({ success: true });
    } catch (error) {
      console.error('Onfido webhook error:', error);
      res.status(500).json({ error: 'Webhook processing failed' });
    }
  }

  async handleStripeIdentityWebhook(req, res) {
    try {
      const event = req.body;

      if (event.type === 'identity.verification_session.verified') {
        const session = event.data.object;
        const userId = session.metadata.user_id;

        await User.findByIdAndUpdate(userId, {
          kycStatus: 'verified',
          kycVerifiedAt: new Date()
        });
      }

      res.json({ success: true });
    } catch (error) {
      console.error('Stripe Identity webhook error:', error);
      res.status(500).json({ error: 'Webhook processing failed' });
    }
  }

  // Get user verification info
  async getVerificationInfo(req, res) {
    try {
      const userId = req.user.id;
      const user = await User.findById(userId).select('kycStatus kycSubmittedAt kycVerifiedAt verificationProvider documents');

      res.json({
        kycStatus: user.kycStatus,
        submittedAt: user.kycSubmittedAt,
        verifiedAt: user.kycVerifiedAt,
        provider: user.verificationProvider,
        documents: user.documents
      });
    } catch (error) {
      console.error('Get verification info error:', error);
      res.status(500).json({ error: 'Failed to get verification info' });
    }
  }
}

module.exports = new VerificationController();
