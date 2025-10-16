import React, { useState, useRef, useEffect, useCallback } from 'react';

const AddressAutocomplete = ({ value, onPlaceSelect, placeholder = "Search for a location..." }) => {
  const [inputValue, setInputValue] = useState(value || '');
  const [predictions, setPredictions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const autocompleteServiceRef = useRef(null);
  const placesServiceRef = useRef(null);

  // Initialize services
  useEffect(() => {
    if (window.google && window.google.maps && window.google.maps.places) {
      if (!autocompleteServiceRef.current) {
        autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();
      }
      if (!placesServiceRef.current) {
        // Create a dummy map for PlacesService (required)
        const dummyMap = new window.google.maps.Map(document.createElement('div'));
        placesServiceRef.current = new window.google.maps.places.PlacesService(dummyMap);
      }
    }
  }, []);

  // Update input value when prop changes
  useEffect(() => {
    setInputValue(value || '');
  }, [value]);

  // Fetch predictions
  const fetchPredictions = useCallback((query) => {
    if (!autocompleteServiceRef.current || !query.trim()) {
      setPredictions([]);
      setShowDropdown(false);
      return;
    }

    autocompleteServiceRef.current.getPlacePredictions(
      {
        input: query,
        types: ['geocode'],
        componentRestrictions: { country: [] }, // Allow all countries
      },
      (predictions, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
          setPredictions(predictions);
          setShowDropdown(true);
          setSelectedIndex(-1);
        } else {
          setPredictions([]);
          setShowDropdown(false);
        }
      }
    );
  }, []);

  // Debounced input change
  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    fetchPredictions(newValue);
  };

  // Handle prediction selection
  const handlePredictionSelect = (prediction) => {
    setInputValue(prediction.description);
    setShowDropdown(false);
    setPredictions([]);

    // Get place details
    if (placesServiceRef.current) {
      placesServiceRef.current.getDetails(
        {
          placeId: prediction.place_id,
          fields: ['formatted_address', 'geometry']
        },
        (place, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
            const location = {
              address: place.formatted_address,
              coordinates: {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
              },
            };
            onPlaceSelect(location);
          }
        }
      );
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (!showDropdown || predictions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, predictions.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handlePredictionSelect(predictions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        setSelectedIndex(-1);
        break;
      default:
        break;
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div style={styles.container}>
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        style={styles.input}
        autoComplete="off"
      />
      {showDropdown && predictions.length > 0 && (
        <div ref={dropdownRef} style={styles.dropdown}>
          {predictions.map((prediction, index) => (
            <div
              key={prediction.place_id}
              style={{
                ...styles.prediction,
                backgroundColor: index === selectedIndex ? 'var(--color-primary)' : 'var(--color-card-bg)',
                color: index === selectedIndex ? 'var(--color-bg)' : 'var(--color-text)',
              }}
              onClick={() => handlePredictionSelect(prediction)}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              {prediction.description}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    position: 'relative',
    width: '100%',
  },
  input: {
    width: '100%',
    padding: '12px',
    marginBottom: '15px',
    borderRadius: 'var(--radius)',
    border: '1px solid var(--color-primary)',
    backgroundColor: 'var(--color-card-bg)',
    color: 'var(--color-text)',
    fontSize: '16px',
    boxSizing: 'border-box',
    outline: 'none',
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: 'var(--color-card-bg)',
    border: '1px solid var(--color-primary)',
    borderRadius: 'var(--radius)',
    maxHeight: '200px',
    overflowY: 'auto',
    zIndex: 1000,
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  prediction: {
    padding: '10px 12px',
    cursor: 'pointer',
    borderBottom: '1px solid var(--color-primary)',
    fontSize: '14px',
  },
};

export default AddressAutocomplete;
