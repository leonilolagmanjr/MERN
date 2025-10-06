import React from 'react';

const WalletBalance = ({ wallet }) => {
  return (
    <div style={styles.balances}>
      {Object.entries(wallet).map(([currency, amount]) => (
        <div key={currency} style={styles.balanceItem}>
          <span style={styles.currency}>{currency}:</span>
          <span style={styles.amount}>{amount}</span>
        </div>
      ))}
    </div>
  );
};

const styles = {
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
};

export default WalletBalance;
