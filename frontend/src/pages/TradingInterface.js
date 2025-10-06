import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { tradeFunds, getWalletBalance } from '../services/api';
import WalletBalance from '../components/WalletBalance';

const TradingInterface = () => {
  const { user } = useAuth();
  const [wallet, setWallet] = useState({});
  const [formData, setFormData] = useState({
    recipientId: '',
    amount: '',
    currency: 'PHP',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = async () => {
    try {
      const token = localStorage.getItem('token');
      const balance = await getWalletBalance(token);
      setWallet(balance);
    } catch (error) {
      console.error('Error fetching wallet:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await tradeFunds(formData, token);
      alert('Trade initiated successfully!');
      setFormData({ recipientId: '', amount: '', currency: 'PHP' });
      fetchWallet();
    } catch (error) {
      console.error('Error trading funds:', error);
      alert('Trade failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Peer-to-Peer Trading</h1>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Your Wallet</h2>
        <WalletBalance wallet={wallet} />
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Send Funds</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            name="recipientId"
            placeholder="Recipient User ID"
            value={formData.recipientId}
            onChange={handleInputChange}
            style={styles.input}
            required
          />
          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={formData.amount}
            onChange={handleInputChange}
            style={styles.input}
            min="0"
            step="0.01"
            required
          />
          <select
            name="currency"
            value={formData.currency}
            onChange={handleInputChange}
            style={styles.input}
          >
            <option value="PHP">PHP</option>
            <option value="USD">USD</option>
            <option value="BTC">BTC</option>
          </select>
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Sending...' : 'Send Funds'}
          </button>
        </form>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>How it works</h2>
        <ul style={styles.list}>
          <li>Enter the recipient's User ID (found on their profile)</li>
          <li>Specify the amount and currency</li>
          <li>Funds are transferred instantly if you have sufficient balance</li>
          <li>All trades are recorded in your transaction history</li>
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
  balances: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
  },
  balanceItem: {
    backgroundColor: '#171a21',
    padding: '15px',
    borderRadius: '5px',
    textAlign: 'center',
  },
  currency: {
    display: 'block',
    fontSize: '14px',
    color: '#a9b7c6',
  },
  amount: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#66c0f4',
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
  list: {
    paddingLeft: '20px',
  },
};

export default TradingInterface;
