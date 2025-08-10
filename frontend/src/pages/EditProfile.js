import React, { useState, useEffect } from 'react';
import { updateUserProfile } from '../services/api';
import { useAuth } from '../context/AuthContext';

const EditProfile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    location: '',
    summary: '',
    avatar: null,
    profileBackground: '',
    featuredBadges: [],
    featuredGroup: '',
    featuredShowcase: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, avatar: e.target.files[0] });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      await updateUserProfile(formData, token);
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err);
    }
  };

  const handleCancel = () => {
    window.location.href = '/profile';
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Edit Profile</h1>
      <p style={styles.description}>Set your user profile name and details here.</p>

      <section style={styles.section}>
        <h2 style={styles.sectionHeading}>General</h2>
        <label style={styles.label}>Profile Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          style={styles.input}
        />
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionHeading}>Location</h2>
        <select
          name="location"
          value={formData.location}
          onChange={handleInputChange}
          style={styles.input}
        >
          {/* Add all countries */}
          <option value="">Select a country</option>
          <option value="United States">United States</option>
          <option value="Canada">Canada</option>
          <option value="United Kingdom">United Kingdom</option>
          {/* Add more countries */}
        </select>
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionHeading}>Summary</h2>
        <textarea
          name="summary"
          value={formData.summary}
          onChange={handleInputChange}
          style={styles.textarea}
        />
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionHeading}>Avatar</h2>
        <input type="file" name="avatar" onChange={handleFileChange} style={styles.input} />
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionHeading}>Profile Background</h2>
        <input
          type="text"
          name="profileBackground"
          value={formData.profileBackground}
          onChange={handleInputChange}
          style={styles.input}
        />
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionHeading}>Featured Badges</h2>
        <input
          type="text"
          name="featuredBadges"
          value={formData.featuredBadges}
          onChange={handleInputChange}
          style={styles.input}
        />
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionHeading}>Featured Group</h2>
        <input
          type="text"
          name="featuredGroup"
          value={formData.featuredGroup}
          onChange={handleInputChange}
          style={styles.input}
        />
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionHeading}>Featured Showcase</h2>
        <input
          type="text"
          name="featuredShowcase"
          value={formData.featuredShowcase}
          onChange={handleInputChange}
          style={styles.input}
        />
      </section>

      <div style={styles.buttonContainer}>
        <button onClick={handleCancel} style={styles.cancelButton}>
          Cancel
        </button>
        <button onClick={handleSave} style={styles.saveButton}>
          Save
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#1b2838',
    color: '#c7d5e0',
    minHeight: '100vh',
  },
  heading: {
    fontSize: '24px',
    color: '#ffffff',
    marginBottom: '10px',
  },
  description: {
    fontSize: '16px',
    color: '#c7d5e0',
    marginBottom: '20px',
  },
  section: {
    marginBottom: '20px',
  },
  sectionHeading: {
    fontSize: '20px',
    color: '#66c0f4',
    marginBottom: '10px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    color: '#c7d5e0',
  },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #66c0f4',
    backgroundColor: '#2a475e',
    color: '#c7d5e0',
    marginBottom: '10px',
  },
  textarea: {
    width: '100%',
    height: '100px',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #66c0f4',
    backgroundColor: '#2a475e',
    color: '#c7d5e0',
    resize: 'none',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  cancelButton: {
    backgroundColor: '#ff4c4c',
    color: '#ffffff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  saveButton: {
    backgroundColor: '#66c0f4',
    color: '#ffffff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default EditProfile;