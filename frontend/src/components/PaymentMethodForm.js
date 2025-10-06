import React, { useState } from 'react';
import { addPaymentMethod } from '../services/api';

const PaymentMethodForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    type: 'card',
    number: '',
    expMonth: '',
    expYear: '',
    cvc: '',
    gcashNumber: '',
    bankName: '',
    accountNumber: '',
    paypalEmail: '',
    mayaNumber: '',
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await addPaymentMethod(formData, token);
      setFormData({
        type: 'card',
        number: '',
        expMonth: '',
        expYear: '',
        cvc: '',
        gcashNumber: '',
        bankName: '',
        accountNumber: '',
      });
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error adding payment method:', error);
      alert('Failed to add payment method: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <select
        name="type"
        value={formData.type}
        onChange={handleInputChange}
        style={styles.input}
      >
        <option value="card">Credit/Debit Card</option>
        <option value="gcash">GCash</option>
        <option value="bank">Bank Transfer</option>
        <option value="paypal">PayPal</option>
        <option value="maya">Maya</option>
      </select>

      {formData.type === 'card' && (
        <>
          <input
            type="text"
            name="number"
            placeholder="Card Number"
            value={formData.number}
            onChange={handleInputChange}
            style={styles.input}
            required
          />
          <input
            type="text"
            name="expMonth"
            placeholder="Exp Month (MM)"
            value={formData.expMonth}
            onChange={handleInputChange}
            style={styles.input}
            required
          />
          <input
            type="text"
            name="expYear"
            placeholder="Exp Year (YYYY)"
            value={formData.expYear}
            onChange={handleInputChange}
            style={styles.input}
            required
          />
          <input
            type="text"
            name="cvc"
            placeholder="CVC"
            value={formData.cvc}
            onChange={handleInputChange}
            style={styles.input}
            required
          />
        </>
      )}

      {formData.type === 'gcash' && (
        <input
          type="text"
          name="gcashNumber"
          placeholder="GCash Number"
          value={formData.gcashNumber}
          onChange={handleInputChange}
          style={styles.input}
          required
        />
      )}

      {formData.type === 'bank' && (
        <>
          <input
            type="text"
            name="bankName"
            placeholder="Bank Name"
            value={formData.bankName}
            onChange={handleInputChange}
            style={styles.input}
            required
          />
          <input
            type="text"
            name="accountNumber"
            placeholder="Account Number"
            value={formData.accountNumber}
            onChange={handleInputChange}
            style={styles.input}
            required
          />
        </>
      )}

      <button type="submit" style={styles.button} disabled={loading}>
        {loading ? 'Adding...' : 'Add Payment Method'}
      </button>
    </form>
  );
};

const styles = {
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
};

export default PaymentMethodForm;
