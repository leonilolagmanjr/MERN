import React, { useState, useEffect } from 'react';
import { editProduct } from '../../services/api';

const UpdateProduct = ({ product, onProductUpdated, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    location: '',
    quantity: '',
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title || '',
        description: product.description || '',
        price: product.price || '',
        category: product.category || '',
        location: product.location || '',
        quantity: product.quantity || '',
      });
    }
  }, [product]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await editProduct(product._id, formData, token);
      setMessage('Product updated successfully!');
      onProductUpdated();
      onClose();
    } catch (err) {
      setMessage('Failed to update product. Please try again.');
    }
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.heading}>Update Product</h3>
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
          type="number"
          placeholder="Price"
          value={formData.price}
          onChange={(e) =>
            setFormData({ ...formData, price: e.target.value })
          }
          style={styles.input}
          required
          min="0"
          step="0.01"
        />
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
        <input
          type="text"
          placeholder="Location"
          value={formData.location}
          onChange={(e) =>
            setFormData({ ...formData, location: e.target.value })
          }
          style={styles.input}
          required
        />
        <input
          type="number"
          placeholder="Quantity"
          value={formData.quantity}
          onChange={(e) =>
            setFormData({ ...formData, quantity: e.target.value })
          }
          style={styles.input}
          required
          min="1"
          step="1"
        />
        <button type="submit" style={styles.button}>
          Update Product
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

export default UpdateProduct;
