import React, { useState } from 'react';
import { postJob } from '../../services/api';
import LocationSelector from './LocationSelector';

const CreateJob = ({ onJobCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    currency: 'USD',
    category: '',
    location: { type: 'remote', address: '', coordinates: { lat: 0, lng: 0 } },
  });
  const [message, setMessage] = useState('');
  const [isCustomCategory, setIsCustomCategory] = useState(false);

  const categories = [
    'Web Development',
    'Graphic Design',
    'Content Writing',
    'Video Editing',
    'Music Production',
    'Game Development',
    'Marketing',
    'Data Entry',
    'Custom',
  ];

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

  const handleCategoryChange = (e) => {
    const selected = e.target.value;
    if (selected === 'Custom') {
      setIsCustomCategory(true);
      setFormData({ ...formData, category: '' });
    } else {
      setIsCustomCategory(false);
      setFormData({ ...formData, category: selected });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const priceNum = parseFloat(formData.price.replace(/[^\d.]/g, ''));
      await postJob({ ...formData, price: priceNum }, token);
      setMessage('Job created successfully!');
      setFormData({
        title: '',
        description: '',
        price: '',
        currency: 'USD',
        category: '',
        location: { type: 'remote', address: '', coordinates: { lat: 0, lng: 0 } },
      });
      setIsCustomCategory(false);
      onJobCreated();
      window.location.href = '/jobmanager';
    } catch (err) {
      setMessage('Failed to create job. Please try again.');
    }
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.heading}>Create Job</h3>
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
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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

        {/* Category Selection */}
        <select
          value={isCustomCategory ? 'Custom' : formData.category}
          onChange={handleCategoryChange}
          style={styles.input}
          required
        >
          <option value="" disabled>Select Category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        {/* Custom Category Input */}
        {isCustomCategory && (
          <input
            type="text"
            placeholder="Enter custom category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            style={styles.input}
            required
          />
        )}

        <LocationSelector
          location={formData.location}
          onLocationChange={(location) => setFormData({ ...formData, location })}
        />

        <button type="submit" style={styles.button}>
          Create Job
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: { marginBottom: '20px' },
  heading: { color: 'var(--color-text)', marginBottom: '10px' },
  message: { color: 'var(--color-primary)', marginBottom: '10px' },
  form: { display: 'flex', flexDirection: 'column', gap: '10px' },
  input: {
    padding: '10px',
    borderRadius: 'var(--radius)',
    border: '1px solid var(--color-primary)',
    backgroundColor: 'var(--color-card-bg)',
    color: 'var(--color-text)',
  },
  textarea: {
    padding: '10px',
    borderRadius: 'var(--radius)',
    border: '1px solid var(--color-primary)',
    backgroundColor: 'var(--color-card-bg)',
    color: 'var(--color-text)',
    resize: 'none',
  },
  button: {
    backgroundColor: 'var(--color-primary)',
    color: 'var(--color-bg)',
    border: 'none',
    padding: '10px 20px',
    borderRadius: 'var(--radius)',
    cursor: 'pointer',
  },
};

export default CreateJob;
