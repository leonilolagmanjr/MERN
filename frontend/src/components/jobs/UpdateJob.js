import React, { useState, useEffect } from 'react';
import { editJob } from '../../services/api';
import LocationSelector from './LocationSelector';

const UpdateJob = ({ job, onJobUpdated, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    currency: 'USD',
    category: '',
    location: { type: 'remote', address: '', coordinates: { lat: 0, lng: 0 } },
  });
  const [message, setMessage] = useState('');

  const currencies = ['USD', 'PHP'];

  const formatPrice = (value, currency) => {
    const num = parseFloat(value.replace(/[^\d.]/g, ''));
    if (isNaN(num)) return '';
    const symbol = currency === 'USD' ? '$' : '₱';
    return `${symbol}${num.toFixed(2)}`;
  };

  const handleCurrencyChange = (e) => {
    const newCurrency = e.target.value;
    const formattedPrice = formatPrice(formData.price, newCurrency);
    setFormData({ ...formData, currency: newCurrency, price: formattedPrice });
  };

  useEffect(() => {
    if (job) {
      let location = { type: 'remote', address: '', coordinates: { lat: 0, lng: 0 } };
      if (typeof job.location === 'string') {
        // Backward compatibility: old string location
        location = { type: 'physical', address: job.location, coordinates: { lat: 0, lng: 0 } };
      } else if (job.location) {
        location = job.location;
      }
      const currency = job.currency || 'USD';
      const formattedPrice = formatPrice(job.price || '', currency);
      setFormData({
        title: job.title || '',
        description: job.description || '',
        price: formattedPrice,
        currency,
        category: job.category || '',
        location,
      });
    }
  }, [job]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const priceNum = parseFloat(formData.price.replace(/[^\d.]/g, ''));
      await editJob(job._id, { ...formData, price: priceNum }, token);
      setMessage('Job updated successfully!');
      onJobUpdated();
      onClose();
    } catch (err) {
      setMessage('Failed to update job. Please try again.');
    }
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.heading}>Update Job</h3>
      {message && <p style={styles.message}>{message}</p>}
      <form style={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          style={styles.input}
          required
        />
        <textarea
          placeholder="Description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          style={styles.textarea}
          required
        />
        <input
          type="text"
          placeholder="Price"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: formatPrice(e.target.value, formData.currency) })}
          style={styles.input}
          required
        />

        {/* Currency Selection */}
        <select
          value={formData.currency}
          onChange={handleCurrencyChange}
          style={styles.input}
          required
        >
          <option value="" disabled>Select Currency</option>
          {currencies.map((curr) => (
            <option key={curr} value={curr}>{curr}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Category"
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
          style={styles.input}
          required
        />
        <LocationSelector
          location={formData.location}
          onLocationChange={(location) => setFormData({ ...formData, location })}
        />
        <button type="submit" style={styles.button}>
          Update Job
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    marginBottom: '20px',
  },
  heading: {
    color: '#ffffff',
    marginBottom: '10px',
  },
  message: {
    color: '#66c0f4',
    marginBottom: '10px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  input: {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #66c0f4',
    backgroundColor: '#1b2838',
    color: '#c7d5e0',
  },
  textarea: {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #66c0f4',
    backgroundColor: '#1b2838',
    color: '#c7d5e0',
    resize: 'none',
  },
  button: {
    backgroundColor: '#66c0f4',
    color: '#ffffff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default UpdateJob;
