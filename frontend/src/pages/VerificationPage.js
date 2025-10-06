import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { initiateVerification, uploadDocument, getVerificationInfo, checkVerificationStatus } from '../services/api';

const VerificationPage = () => {
  const { user } = useAuth();
  const [verificationInfo, setVerificationInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    provider: 'jumio',
    firstName: '',
    lastName: '',
    email: user?.email || '',
    documentType: 'id_card'
  });
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchVerificationInfo();
  }, []);

  const fetchVerificationInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      const info = await getVerificationInfo(token);
      setVerificationInfo(info);
    } catch (error) {
      console.error('Error fetching verification info:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleInitiateVerification = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const result = await initiateVerification(formData, token);
      alert('Verification initiated successfully! Please complete the verification process.');
      fetchVerificationInfo();
    } catch (error) {
      console.error('Error initiating verification:', error);
      alert('Failed to initiate verification: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert('Please select a file to upload');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const formDataUpload = new FormData();
      formDataUpload.append('document', selectedFile);
      formDataUpload.append('documentType', formData.documentType);

      const result = await uploadDocument(formDataUpload, token);
      alert('Document uploaded successfully!');
      setSelectedFile(null);
      fetchVerificationInfo();
    } catch (error) {
      console.error('Error uploading document:', error);
      alert('Failed to upload document: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified': return '#4CAF50';
      case 'pending': return '#FF9800';
      case 'rejected': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'unverified': return 'Not Verified';
      case 'pending': return 'Under Review';
      case 'verified': return 'Verified';
      case 'rejected': return 'Rejected';
      default: return 'Unknown';
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Identity Verification (KYC)</h1>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Verification Status</h2>
        {verificationInfo ? (
          <div style={styles.statusContainer}>
            <div style={{ ...styles.statusBadge, backgroundColor: getStatusColor(verificationInfo.kycStatus) }}>
              {getStatusText(verificationInfo.kycStatus)}
            </div>
            {verificationInfo.submittedAt && (
              <p><strong>Submitted:</strong> {new Date(verificationInfo.submittedAt).toLocaleDateString()}</p>
            )}
            {verificationInfo.verifiedAt && (
              <p><strong>Verified:</strong> {new Date(verificationInfo.verifiedAt).toLocaleDateString()}</p>
            )}
            {verificationInfo.provider && (
              <p><strong>Provider:</strong> {verificationInfo.provider}</p>
            )}
          </div>
        ) : (
          <p>Loading verification status...</p>
        )}
      </div>

      {verificationInfo?.kycStatus === 'unverified' && (
        <>
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Third-Party Verification</h2>
            <p>Choose a verification provider to verify your identity:</p>
            <form onSubmit={handleInitiateVerification} style={styles.form}>
              <select
                name="provider"
                value={formData.provider}
                onChange={handleInputChange}
                style={styles.input}
              >
                <option value="jumio">Jumio Netverify</option>
                <option value="onfido">Onfido</option>
                <option value="stripe_identity">Stripe Identity</option>
              </select>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleInputChange}
                style={styles.input}
                required
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleInputChange}
                style={styles.input}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                style={styles.input}
                required
              />
              <button type="submit" style={styles.button} disabled={loading}>
                {loading ? 'Initiating...' : 'Start Verification'}
              </button>
            </form>
          </div>

          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Document Upload</h2>
            <p>Alternatively, upload identity documents for manual verification:</p>
            <form onSubmit={handleDocumentUpload} style={styles.form}>
              <select
                name="documentType"
                value={formData.documentType}
                onChange={handleInputChange}
                style={styles.input}
              >
                <option value="id_card">ID Card</option>
                <option value="passport">Passport</option>
                <option value="driving_licence">Driver's License</option>
                <option value="proof_of_address">Proof of Address</option>
              </select>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={styles.input}
                required
              />
              <button type="submit" style={styles.button} disabled={loading}>
                {loading ? 'Uploading...' : 'Upload Document'}
              </button>
            </form>
          </div>
        </>
      )}

      {verificationInfo?.documents && verificationInfo.documents.length > 0 && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Uploaded Documents</h2>
          {verificationInfo.documents.map((doc, index) => (
            <div key={index} style={styles.documentItem}>
              <p><strong>Type:</strong> {doc.type}</p>
              <p><strong>Status:</strong> <span style={{ color: getStatusColor(doc.status) }}>{doc.status}</span></p>
              <p><strong>Uploaded:</strong> {new Date(doc.uploadedAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Why Verification is Required</h2>
        <ul style={styles.list}>
          <li>Compliance with financial regulations</li>
          <li>Enhanced security for all users</li>
          <li>Prevention of fraud and money laundering</li>
          <li>Access to higher transaction limits</li>
          <li>Building trust in the platform</li>
        </ul>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#1b2838',
    color: '#c7d5e0',
    minHeight: '100vh',
  },
  title: {
    fontSize: '24px',
    marginBottom: '20px',
    color: '#66c0f4',
  },
  section: {
    marginBottom: '30px',
    backgroundColor: '#2a475e',
    padding: '20px',
    borderRadius: '10px',
  },
  sectionTitle: {
    fontSize: '20px',
    marginBottom: '15px',
    color: '#66c0f4',
  },
  statusContainer: {
    textAlign: 'center',
  },
  statusBadge: {
    display: 'inline-block',
    padding: '10px 20px',
    borderRadius: '20px',
    color: 'white',
    fontWeight: 'bold',
    marginBottom: '15px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    marginBottom: '10px',
    padding: '10px',
    backgroundColor: '#171a21',
    border: '1px solid #66c0f4',
    borderRadius: '5px',
    color: '#c7d5e0',
  },
  button: {
    padding: '10px',
    backgroundColor: '#66c0f4',
    color: '#ffffff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  documentItem: {
    backgroundColor: '#171a21',
    padding: '15px',
    marginBottom: '10px',
    borderRadius: '5px',
  },
  list: {
    paddingLeft: '20px',
  },
};

export default VerificationPage;
