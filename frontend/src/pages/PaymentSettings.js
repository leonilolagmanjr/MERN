import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getPaymentMethods, deletePaymentMethod, depositFunds, withdrawFunds, getWalletBalance } from '../services/api';
import PaymentMethodForm from '../components/PaymentMethodForm';
import WalletBalance from '../components/WalletBalance';

const PaymentSettings = () => {
  const { user } = useAuth();
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [wallet, setWallet] = useState({});
  const [depositData, setDepositData] = useState({ paymentMethodId: '', amount: '', currency: 'PHP' });
  const [withdrawData, setWithdrawData] = useState({ paymentMethodId: '', amount: '', currency: 'PHP' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [methods, balance] = await Promise.all([
        getPaymentMethods(token),
        getWalletBalance(token),
      ]);
      setPaymentMethods(methods);
      setWallet(balance);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await deletePaymentMethod(id, token);
      fetchData();
    } catch (error) {
      console.error('Error deleting payment method:', error);
    }
  };

  const handleDepositChange = (e) => {
    setDepositData({ ...depositData, [e.target.name]: e.target.value });
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await depositFunds(depositData, token);
      alert('Deposit successful!');
      setDepositData({ paymentMethodId: '', amount: '', currency: 'PHP' });
      fetchData();
    } catch (error) {
      console.error('Error depositing:', error);
      alert('Deposit failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawChange = (e) => {
    setWithdrawData({ ...withdrawData, [e.target.name]: e.target.value });
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await withdrawFunds(withdrawData, token);
      alert('Withdrawal successful!');
      setWithdrawData({ paymentMethodId: '', amount: '', currency: 'PHP' });
      fetchData();
    } catch (error) {
      console.error('Error withdrawing:', error);
      alert('Withdrawal failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFakeDeposit = async () => {
    // Fake deposit for testing
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await depositFunds({ paymentMethodId: 'fake', amount: 100, currency: 'PHP' }, token);
      alert('Fake deposit of 100 PHP added!');
      fetchData();
    } catch (error) {
      console.error('Error fake depositing:', error);
      alert('Fake deposit failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Payment Settings</h1>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Add Payment Method</h2>
        <PaymentMethodForm onSuccess={fetchData} />
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Wallet Balance</h2>
        <WalletBalance wallet={wallet} />
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Deposit Funds</h2>
        <form onSubmit={handleDeposit} style={styles.form}>
          <select
            name="paymentMethodId"
            value={depositData.paymentMethodId}
            onChange={handleDepositChange}
            style={styles.input}
            required
          >
            <option value="">Select Payment Method</option>
            {paymentMethods.map((method) => (
              <option key={method._id} value={method._id}>
                {method.type === 'card' ? `Card **** ${method.last4}` : method.type === 'gcash' ? `GCash ${method.gcashNumber}` : `Bank ${method.accountNumber}`}
              </option>
            ))}
          </select>
          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={depositData.amount}
            onChange={handleDepositChange}
            style={styles.input}
            min="0"
            step="0.01"
            required
          />
          <select
            name="currency"
            value={depositData.currency}
            onChange={handleDepositChange}
            style={styles.input}
          >
            <option value="PHP">PHP</option>
            <option value="USD">USD</option>
            <option value="BTC">BTC</option>
          </select>
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Depositing...' : 'Deposit'}
          </button>
        </form>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Withdraw Funds</h2>
        <form onSubmit={handleWithdraw} style={styles.form}>
          <select
            name="paymentMethodId"
            value={withdrawData.paymentMethodId}
            onChange={handleWithdrawChange}
            style={styles.input}
            required
          >
            <option value="">Select Payment Method</option>
            {paymentMethods.map((method) => (
              <option key={method._id} value={method._id}>
                {method.type === 'card' ? `Card **** ${method.last4}` : method.type === 'gcash' ? `GCash ${method.gcashNumber}` : `Bank ${method.accountNumber}`}
              </option>
            ))}
          </select>
          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={withdrawData.amount}
            onChange={handleWithdrawChange}
            style={styles.input}
            min="0"
            step="0.01"
            required
          />
          <select
            name="currency"
            value={withdrawData.currency}
            onChange={handleWithdrawChange}
            style={styles.input}
          >
            <option value="PHP">PHP</option>
            <option value="USD">USD</option>
            <option value="BTC">BTC</option>
          </select>
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Withdrawing...' : 'Withdraw'}
          </button>
        </form>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Test Mode</h2>
        <p>Add fake funds to your wallet for testing purposes.</p>
        <button onClick={handleFakeDeposit} style={styles.button} disabled={loading}>
          {loading ? 'Adding...' : 'Add 100 PHP (Fake)'}
        </button>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Your Payment Methods</h2>
        {paymentMethods.length === 0 ? (
          <p>No payment methods added yet.</p>
        ) : (
          paymentMethods.map((method) => (
            <div key={method._id} style={styles.methodItem}>
              <div>
                <p><strong>Type:</strong> {method.type}</p>
                {method.type === 'card' && (
                  <p><strong>Card:</strong> **** **** **** {method.last4} ({method.brand})</p>
                )}
                {method.type === 'gcash' && (
                  <p><strong>GCash:</strong> {method.gcashNumber}</p>
                )}
                {method.type === 'bank' && (
                  <p><strong>Bank:</strong> {method.bankName} - {method.accountNumber}</p>
                )}
              </div>
              <button
                onClick={() => handleDelete(method._id)}
                style={styles.deleteButton}
              >
                Delete
              </button>
            </div>
          ))
        )}
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
  methodItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px',
    backgroundColor: '#171a21',
    marginBottom: '10px',
    borderRadius: '5px',
  },
  deleteButton: {
    backgroundColor: '#c42b2b',
    color: '#ffffff',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default PaymentSettings;
