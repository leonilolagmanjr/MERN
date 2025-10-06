import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getTransactions, getWalletBalance } from '../services/api';
import TransactionItem from '../components/TransactionItem';
import WalletBalance from '../components/WalletBalance';

const TransactionHistory = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [wallet, setWallet] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [txns, balance] = await Promise.all([
        getTransactions(token),
        getWalletBalance(token),
      ]);
      setTransactions(txns);
      setWallet(balance);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Transaction History & Wallet</h1>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Wallet Balance</h2>
        <WalletBalance wallet={wallet} />
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Transaction History</h2>
        {transactions.length === 0 ? (
          <p>No transactions yet.</p>
        ) : (
          <div style={styles.transactionList}>
            {transactions.map((txn) => (
              <TransactionItem key={txn._id} transaction={txn} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const getStatusStyle = (status) => {
  switch (status) {
    case 'completed':
      return { color: '#4CAF50' };
    case 'pending':
      return { color: '#FF9800' };
    case 'failed':
      return { color: '#F44336' };
    default:
      return { color: '#c7d5e0' };
  }
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
  loading: {
    textAlign: 'center',
    padding: '50px',
    fontSize: '18px',
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
  transactionList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  transactionItem: {
    backgroundColor: '#171a21',
    padding: '15px',
    borderRadius: '5px',
  },
  transactionInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
};

export default TransactionHistory;
