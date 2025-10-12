import React, { useState } from 'react';
import MapModal from './MapModal';

const LocationSelector = ({ location, onLocationChange }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleTypeChange = (e) => {
    const type = e.target.value;
    onLocationChange({
      ...location,
      type,
      address: type === 'remote' ? '' : location.address,
      coordinates: type === 'remote' ? null : location.coordinates,
    });
  };

  const handleLocationSelect = (address, coordinates) => {
    onLocationChange({
      ...location,
      address,
      coordinates,
    });
    setIsModalOpen(false);
  };

  return (
    <div style={styles.container}>
      <label style={styles.label}>Location Type:</label>
      <div style={styles.radioGroup}>
        <label style={styles.radioLabel}>
          <input
            type="radio"
            value="remote"
            checked={location.type === 'remote'}
            onChange={handleTypeChange}
          />
          Remote
        </label>
        <label style={styles.radioLabel}>
          <input
            type="radio"
            value="physical"
            checked={location.type === 'physical'}
            onChange={handleTypeChange}
          />
          Physical
        </label>
      </div>
      {location.type === 'physical' && (
        <div style={styles.physicalContainer}>
          <button type="button" onClick={() => setIsModalOpen(true)} style={styles.button}>
            Select Location on Map
          </button>
          {location.address && (
            <p style={styles.selectedLocation}>Selected: {location.address}</p>
          )}
        </div>
      )}
      <MapModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onLocationSelect={handleLocationSelect}
      />
    </div>
  );
};

const styles = {
  container: { marginBottom: '20px' },
  label: { display: 'block', color: 'var(--color-text)', marginBottom: '10px' },
  radioGroup: { display: 'flex', gap: '20px', marginBottom: '10px' },
  radioLabel: { color: 'var(--color-text)', cursor: 'pointer' },
  physicalContainer: { marginTop: '10px' },
  button: {
    backgroundColor: 'var(--color-primary)',
    color: 'var(--color-bg)',
    border: 'none',
    padding: '10px 20px',
    borderRadius: 'var(--radius)',
    cursor: 'pointer',
  },
  selectedLocation: { color: 'var(--color-primary)', marginTop: '10px' },
};

export default LocationSelector;
