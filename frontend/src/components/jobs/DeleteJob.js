import React, { useState } from 'react';
import { deleteJob } from '../../services/api';

const DeleteJob = ({ job, onJobDeleted, onClose }) => {
  const [message, setMessage] = useState('');

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await deleteJob(job._id, token);
      setMessage('Job deleted successfully!');
      onJobDeleted();
      onClose();
    } catch (err) {
      setMessage('Failed to delete job. Please try again.');
    }
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.heading}>Delete Job</h3>
      {message && <p style={styles.message}>{message}</p>}
      <p>Are you sure you want to delete "{job.title}"?</p>
      <div style={styles.buttonContainer}>
        <button onClick={onClose} style={styles.cancelButton}>
          Cancel
        </button>
        <button onClick={handleDelete} style={styles.deleteButton}>
          Delete Job
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
    color: 'var(--color-text)',
    marginBottom: '10px',
  },
  message: {
    color: 'var(--color-primary)',
    marginBottom: '10px',
  },
  buttonContainer: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'flex-end',
  },
  cancelButton: {
    backgroundColor: 'var(--color-button-bg)',
    color: 'var(--color-text)',
    border: '1px solid var(--color-primary)',
    padding: '10px 20px',
    borderRadius: 'var(--radius)',
    cursor: 'pointer',
  },
  deleteButton: {
    backgroundColor: 'var(--color-error)',
    color: 'var(--color-bg)',
    border: 'none',
    padding: '10px 20px',
    borderRadius: 'var(--radius)',
    cursor: 'pointer',
  },
};

export default DeleteJob;
