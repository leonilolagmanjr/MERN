import React, { useState } from 'react';
import { postJob } from '../../services/api';
import LocationSelector from './LocationSelector';

const CreateJob = ({ onJobCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: '',
    category: '',
    location: { type: 'remote', address: '', coordinates: { lat: 0, lng: 0 } },
    deadline: '',
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
      await postJob(formData, token);
      setMessage('Job created successfully!');
      setFormData({
        title: '',
        description: '',
        difficulty: '',
        category: '',
        location: { type: 'remote', address: '', coordinates: { lat: 0, lng: 0 } },
        deadline: '',
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
          placeholder="Difficulty"
          value={formData.difficulty}
          onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
          style={styles.input}
          required
        />

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

        <input
          type="date"
          value={formData.deadline}
          onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
          style={styles.input}
          required
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
  heading: { color: '#ffffff', marginBottom: '10px' },
  message: { color: '#66c0f4', marginBottom: '10px' },
  form: { display: 'flex', flexDirection: 'column', gap: '10px' },
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

export default CreateJob;
