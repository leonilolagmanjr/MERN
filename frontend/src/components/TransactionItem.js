import React from 'react';

const TransactionItem = ({ transaction }) => {
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

  return (
    <div style={styles.transactionItem}>
      <div style={styles.transactionInfo}>
        <p><strong>Type:</strong> {transaction.type}</p>
        <p><strong>Amount:</strong> {transaction.amount} {transaction.currency}</p>
        <p><strong>Status:</strong> <span style={getStatusStyle(transaction.status)}>{transaction.status}</span></p>
        <p><strong>Date:</strong> {new Date(transaction.createdAt).toLocaleString()}</p>
        {transaction.description && <p><strong>Description:</strong> {transaction.description}</p>}
      </div>
    </div>
  );
};

const styles = {
  transactionItem: {
    backgroundColor: '#171a21',
    padding: '15px',
    borderRadius: '5px',
    marginBottom: '10px',
  },
  transactionInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
};

export default TransactionItem;
