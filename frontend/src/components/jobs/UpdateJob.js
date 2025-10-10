import React, { useState, useEffect } from 'react';
import { editJob } from '../../services/api';
import LocationSelector from './LocationSelector';

const UpdateJob = ({ job, onJobUpdated, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: '',
    category: '',
    location: { type: 'remote', address: '', coordinates: { lat: 0, lng: 0 } },
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (job) {
      let location = { type: 'remote', address: '', coordinates: { lat: 0, lng: 0 } };
      if (typeof job.location === 'string') {
        // Backward compatibility: old string location
        location = { type: 'physical', address: job.location, coordinates: { lat: 0, lng: 0 } };
      } else if (job.location) {
        location = job.location;
      }
      setFormData({
        title: job.title || '',
        description: job.description || '',
        difficulty: job.difficulty || '',
        category: job.category || '',
        location,
      });
    }
  }, [job]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await editJob(job._id, formData, token);
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
          placeholder="Difficulty"
          value={formData.difficulty}
          onChange={(e) =>
            setFormData({ ...formData, difficulty: e.target.value })
          }
          style={styles.input}
          required
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
