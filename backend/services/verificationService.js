const axios = require('axios');
const crypto = require('crypto');

// Third-party verification service configurations
const jumioToken = process.env.JUMIO_API_TOKEN || 'test_token';
const jumioSecret = process.env.JUMIO_API_SECRET || 'test_secret';
const onfidoToken = process.env.ONFIDO_API_TOKEN || 'test_token';
const stripeIdentitySecret = process.env.STRIPE_IDENTITY_SECRET || 'sk_test_...';

class VerificationService {
  // Jumio Netverify integration
  async initiateJumioVerification(userId, userData) {
    try {
      const timestamp = Math.floor(Date.now() / 1000);
      const nonce = crypto.randomBytes(16).toString('hex');

      // Create authorization header
      const authString = `${jumioToken}:${timestamp}:${nonce}`;
      const authHeader = 'Basic ' + Buffer.from(authString).toString('base64');

      const response = await axios.post('https://netverify.com/api/v4/initiate', {
        merchantIdScanReference: userId,
        successUrl: `${process.env.FRONTEND_URL}/verification/success`,
        errorUrl: `${process.env.FRONTEND_URL}/verification/error`,
        callbackUrl: `${process.env.BACKEND_URL}/api/verification/jumio/callback`,
        customerInternalReference: userId,
        userReference: userData.email,
        reportingCriteria: 'DETAILED',
        workflowDefinition: {
          key: 100,
          capabilities: ['ID_VERIFICATION', 'FACIAL_BIOMETRICS']
        }
      }, {
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json',
          'User-Agent': 'YourApp/1.0'
        }
      });

      return {
        verificationId: response.data.jumioIdScanReference,
        redirectUrl: response.data.clientRedirectUrl,
        provider: 'jumio'
      };
    } catch (error) {
      throw new Error('Jumio verification initiation failed: ' + error.message);
    }
  }

  // Onfido integration
  async createOnfidoApplicant(userData) {
    try {
      const response = await axios.post('https://api.onfido.com/v3/applicants', {
        first_name: userData.firstName,
        last_name: userData.lastName,
        email: userData.email,
      }, {
        headers: {
          'Authorization': `Token token=${onfidoToken}`,
          'Content-Type': 'application/json'
        }
      });

      return {
        applicantId: response.data.id,
        provider: 'onfido'
      };
    } catch (error) {
      throw new Error('Onfido applicant creation failed: ' + error.message);
    }
  }

  async createOnfidoCheck(applicantId, documentData) {
    try {
      const response = await axios.post('https://api.onfido.com/v3/checks', {
        applicant_id: applicantId,
        report_names: ['identity', 'document', 'facial_similarity'],
        documents: [{
          type: documentData.type, // 'passport', 'driving_licence', 'national_identity_card'
          side: 'front'
        }]
      }, {
        headers: {
          'Authorization': `Token token=${onfidoToken}`,
          'Content-Type': 'application/json'
        }
      });

      return {
        checkId: response.data.id,
        status: response.data.status
      };
    } catch (error) {
      throw new Error('Onfido check creation failed: ' + error.message);
    }
  }

  // Stripe Identity integration
  async createStripeIdentityVerification(userData) {
    try {
      const stripe = require('stripe')(stripeIdentitySecret);

      const verificationSession = await stripe.identity.verificationSessions.create({
        type: 'document',
        metadata: {
          user_id: userData.userId
        },
        options: {
          document: {
            allowed_types: ['id_card', 'passport', 'driving_license'],
            require_id_number: true,
            require_live_capture: true,
            require_matching_selfie: true
          }
        }
      });

      return {
        sessionId: verificationSession.id,
        clientSecret: verificationSession.client_secret,
        url: verificationSession.url,
        provider: 'stripe_identity'
      };
    } catch (error) {
      throw new Error('Stripe Identity verification failed: ' + error.message);
    }
  }

  // Verify uploaded documents (basic implementation)
  async verifyDocument(documentUrl, documentType) {
    // In a real implementation, this would use OCR and AI services
    // For now, we'll simulate document verification
    try {
      // Simulate API call to document verification service
      const isValid = Math.random() > 0.1; // 90% success rate for demo

      return {
        isValid,
        confidence: Math.random() * 0.3 + 0.7, // 70-100% confidence
        extractedData: {
          documentNumber: 'DOC' + Math.random().toString(36).substr(2, 9).toUpperCase(),
          expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
          issueDate: new Date()
        }
      };
    } catch (error) {
      throw new Error('Document verification failed: ' + error.message);
    }
  }

  // Check verification status
  async checkVerificationStatus(verificationId, provider) {
    try {
      switch (provider) {
        case 'jumio':
          // Check Jumio status
          return await this.checkJumioStatus(verificationId);
        case 'onfido':
          // Check Onfido status
          return await this.checkOnfidoStatus(verificationId);
        case 'stripe_identity':
          // Check Stripe Identity status
          return await this.checkStripeIdentityStatus(verificationId);
        default:
          return { status: 'unknown' };
      }
    } catch (error) {
      throw new Error('Status check failed: ' + error.message);
    }
  }

  async checkJumioStatus(scanReference) {
    // Implementation for checking Jumio verification status
    return { status: 'completed', result: 'APPROVED' };
  }

  async checkOnfidoStatus(checkId) {
    // Implementation for checking Onfido verification status
    return { status: 'completed', result: 'clear' };
  }

  async checkStripeIdentityStatus(sessionId) {
    // Implementation for checking Stripe Identity status
    return { status: 'verified', result: 'approved' };
  }

  // Compliance checks for transactions
  async checkTransactionCompliance(userId, amount, currency) {
    const User = require('../models/User');
    const user = await User.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    // Check KYC status
    if (user.kycStatus !== 'verified') {
      return {
        allowed: false,
        reason: 'KYC verification required',
        requiredAction: 'complete_kyc'
      };
    }

    // Check transaction limits based on verification level
    const limits = {
      verified: { daily: 50000, monthly: 500000 },
      premium: { daily: 100000, monthly: 1000000 }
    };

    const userLimit = limits.verified; // Default to verified limits

    // Check daily/monthly limits (simplified)
    if (amount > userLimit.daily) {
      return {
        allowed: false,
        reason: `Transaction exceeds daily limit of ${userLimit.daily} ${currency}`,
        requiredAction: 'upgrade_verification'
      };
    }

    return { allowed: true };
  }
}

module.exports = new VerificationService();
