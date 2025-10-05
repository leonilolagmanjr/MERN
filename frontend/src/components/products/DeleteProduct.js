import React, { useState } from 'react';
import { deleteProduct } from '../../services/api';

const DeleteProduct = ({ product, onProductDeleted, onClose }) => {
  const [message, setMessage] = useState('');

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await deleteProduct(product._id, token);
      setMessage('Product deleted successfully!');
      onProductDeleted();
      onClose();
    } catch (err) {
      setMessage('Failed to delete product. Please try again.');
    }
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.heading}>Delete Product</h3>
      {message && <p style={styles.message}>{message}</p>}
      <p>Are you sure you want to delete "{product.title}"?</p>
      <div style={styles.buttonContainer}>
        <button onClick={onClose} style={styles.cancelButton}>
          Cancel
        </button>
        <button onClick={handleDelete} style={styles.deleteButton}>
          Delete Product
        </button>
      </div>
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
  buttonContainer: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'flex-end',
  },
  cancelButton: {
    backgroundColor: '#666',
    color: '#ffffff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  deleteButton: {
    backgroundColor: '#ff4c4c',
    color: '#ffffff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default DeleteProduct;
