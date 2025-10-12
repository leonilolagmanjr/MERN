import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Wrapper, Status } from '@googlemaps/react-wrapper';

const MapModal = ({ isOpen, onClose, onLocationSelect }) => {
  const [selectedLocation, setSelectedLocation] = useState(null);

  const handlePlaceSelect = useCallback((location) => {
    setSelectedLocation(location);
  }, []);

  const handleConfirm = () => {
    if (selectedLocation) {
      onLocationSelect(selectedLocation.address, selectedLocation.coordinates);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3 style={styles.title}>Select Location</h3>
        <Wrapper 
          apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY} 
          libraries={['places']} 
          render={render}
        >
          <MapComponent
            center={{ lat: 40.7128, lng: -74.0060 }}
            zoom={10}
            onLocationSelect={handlePlaceSelect}
            selectedLocation={selectedLocation}
          />
        </Wrapper>
        <div style={styles.actions}>
          <button 
            onClick={handleConfirm} 
            style={styles.confirmButton} 
            disabled={!selectedLocation}
          >
            Confirm Location
          </button>
          <button onClick={onClose} style={styles.cancelButton}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const render = (status) => {
  if (status === Status.LOADING) return <div>Loading...</div>;
  if (status === Status.FAILURE) return <div>Error loading map</div>;
  return null;
};

const MapComponent = ({ center, zoom, onLocationSelect, selectedLocation }) => {
  const mapRef = useRef(null);
  const inputRef = useRef(null);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [autocomplete, setAutocomplete] = useState(null);

  // Initialize map
  useEffect(() => {
    if (!map && mapRef.current && window.google) {
      const mapInstance = new window.google.maps.Map(mapRef.current, {
        center,
        zoom,
      });
      setMap(mapInstance);

      // Create initial marker
      const markerInstance = new window.google.maps.Marker({
        position: center,
        map: mapInstance,
        draggable: true,
      });
      setMarker(markerInstance);

      // Add click listener to map
      mapInstance.addListener('click', (event) => {
        const position = event.latLng;
        const geocoder = new window.google.maps.Geocoder();
        
        geocoder.geocode({ location: position }, (results, status) => {
          if (status === 'OK' && results[0]) {
            const address = results[0].formatted_address;
            const location = {
              address,
              coordinates: { lat: position.lat(), lng: position.lng() },
            };
            onLocationSelect(location);
            markerInstance.setPosition(position);
          }
        });
      });

      // Add dragend listener to marker
      markerInstance.addListener('dragend', (event) => {
        const position = event.latLng;
        const geocoder = new window.google.maps.Geocoder();
        
        geocoder.geocode({ location: position }, (results, status) => {
          if (status === 'OK' && results[0]) {
            const address = results[0].formatted_address;
            const location = {
              address,
              coordinates: { lat: position.lat(), lng: position.lng() },
            };
            onLocationSelect(location);
          }
        });
      });
    }
  }, [map, center, zoom, onLocationSelect]);

  // Initialize autocomplete after map is ready
  useEffect(() => {
    if (map && inputRef.current && window.google && window.google.maps.places) {
      // Create autocomplete
      const autocompleteInstance = new window.google.maps.places.Autocomplete(
        inputRef.current,
        {
          types: ['geocode'],
          fields: ['formatted_address', 'geometry', 'name']
        }
      );

      // Add place changed listener
      autocompleteInstance.addListener('place_changed', () => {
        const place = autocompleteInstance.getPlace();
        
        if (place.geometry && place.geometry.location) {
          const location = {
            address: place.formatted_address,
            coordinates: {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            },
          };
          
          onLocationSelect(location);
          
          // Update marker position
          if (marker) {
            marker.setPosition(place.geometry.location);
          }
          
          // Center map on selected location
          map.setCenter(place.geometry.location);
          map.setZoom(15);
        }
      });

      setAutocomplete(autocompleteInstance);

      // Cleanup
      return () => {
        if (autocompleteInstance) {
          window.google.maps.event.clearInstanceListeners(autocompleteInstance);
        }
      };
    }
  }, [map, marker, onLocationSelect]);

  // Update marker when selectedLocation changes
  useEffect(() => {
    if (marker && selectedLocation && selectedLocation.coordinates) {
      marker.setPosition(selectedLocation.coordinates);
      if (map) {
        map.setCenter(selectedLocation.coordinates);
        map.setZoom(15);
      }
    }
  }, [marker, selectedLocation, map]);

  // Prevent form submission on enter
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  return (
    <div style={styles.mapContainer}>
      <input
        ref={inputRef}
        type="text"
        placeholder="Search for a location..."
        style={styles.autocomplete}
        onKeyPress={handleKeyPress}
      />
      <div ref={mapRef} style={styles.map} />
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: 'var(--color-bg)',
    padding: '20px',
    borderRadius: 'var(--radius)',
    width: '90%',
    maxWidth: '800px',
    maxHeight: '90vh',
    overflowY: 'auto',
    color: 'var(--color-text)',
    boxSizing: 'border-box',
  },
  title: {
    marginBottom: '20px',
    color: 'var(--color-text)',
    textAlign: 'center'
  },
  mapContainer: {
    height: '500px',
    marginBottom: '20px',
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  autocomplete: {
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
  map: {
    flex: 1,
    width: '100%',
    borderRadius: 'var(--radius)',
    border: '1px solid var(--color-primary)',
  },
  actions: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '15px',
    marginTop: '20px'
  },
  confirmButton: {
    backgroundColor: 'var(--color-primary)',
    color: 'var(--color-bg)',
    border: 'none',
    padding: '12px 24px',
    borderRadius: 'var(--radius)',
    cursor: 'pointer',
    flex: 1,
    fontSize: '16px',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: 'var(--color-button-bg)',
    color: 'var(--color-text)',
    border: '1px solid var(--color-primary)',
    padding: '12px 24px',
    borderRadius: 'var(--radius)',
    cursor: 'pointer',
    flex: 1,
    fontSize: '16px',
    fontWeight: 'bold',
  },
};

export default MapModal;