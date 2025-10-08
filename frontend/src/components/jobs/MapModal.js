import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Wrapper, Status } from '@googlemaps/react-wrapper';

const MapModal = ({ isOpen, onClose, onLocationSelect }) => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const autocompleteRef = useRef(null);

  const handlePlaceSelect = useCallback(() => {
    const place = autocompleteRef.current.getPlace();
    if (place && place.geometry) {
      const location = {
        address: place.formatted_address,
        coordinates: {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        },
      };
      setSelectedLocation(location);
    }
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
        <Wrapper apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY} libraries={['places']} render={render}>
          <MapComponent
            center={{ lat: 40.7128, lng: -74.0060 }} // Default to NYC
            zoom={10}
            onLocationSelect={setSelectedLocation}
            autocompleteRef={autocompleteRef}
            onPlaceSelect={handlePlaceSelect}
            selectedLocation={selectedLocation}
          />
        </Wrapper>
        <div style={styles.actions}>
          <button onClick={handleConfirm} style={styles.confirmButton} disabled={!selectedLocation}>
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

const MapComponent = ({ center, zoom, onLocationSelect, autocompleteRef, onPlaceSelect, selectedLocation }) => {
  const mapRef = useRef(null);
  const inputRef = useRef(null);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);

  // Initialize map and marker
  useEffect(() => {
    if (window.google && window.google.maps && mapRef.current && !map) {
      const mapInstance = new window.google.maps.Map(mapRef.current, {
        center,
        zoom,
      });
      setMap(mapInstance);

      const markerInstance = new window.google.maps.Marker({
        position: center,
        map: mapInstance,
        draggable: true,
      });

      const geocoder = new window.google.maps.Geocoder();

      markerInstance.addListener('dragend', (event) => {
        const position = event.latLng;
        geocoder.geocode({ location: position }, (results, status) => {
          if (status === window.google.maps.GeocoderStatus.OK && results[0]) {
            const address = results[0].formatted_address;
            onLocationSelect({
              address,
              coordinates: { lat: position.lat(), lng: position.lng() },
            });
          } else {
            onLocationSelect({
              address: '',
              coordinates: { lat: position.lat(), lng: position.lng() },
            });
          }
        });
      });

      setMarker(markerInstance);
    }
  }, [center, zoom, onLocationSelect, map]);

  // Initialize autocomplete
  useEffect(() => {
    if (inputRef.current && window.google && window.google.maps && window.google.maps.places && !autocompleteRef.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current);
      autocomplete.addListener('place_changed', onPlaceSelect);
      autocompleteRef.current = autocomplete;

      return () => {
        if (autocompleteRef.current) {
          window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
        }
      };
    }
  }, [onPlaceSelect, autocompleteRef]);

  // Update marker position when selectedLocation changes
  useEffect(() => {
    if (marker && selectedLocation && selectedLocation.coordinates) {
      marker.setPosition(selectedLocation.coordinates);
      if (map) {
        map.setCenter(selectedLocation.coordinates);
        map.setZoom(15);
      }
    }
  }, [marker, selectedLocation, map]);

  return (
    <div style={styles.mapContainer}>
      <input
        ref={inputRef}
        type="text"
        placeholder="Search for a location"
        style={styles.autocomplete}
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
    backgroundColor: '#1b2838',
    padding: '20px',
    borderRadius: '10px',
    width: '80%',
    maxWidth: '600px',
    maxHeight: '90vh',
    overflowY: 'auto',
    color: '#c7d5e0',
  },
  title: { marginBottom: '20px', color: '#ffffff' },
  mapContainer: { height: '400px', marginBottom: '20px', position: 'relative', zIndex: 1, overflow: 'hidden' },
  map: { height: '100%', width: '100%', boxSizing: 'border-box' },
  autocomplete: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '5px',
    border: '1px solid #66c0f4',
    backgroundColor: '#2a475e',
    color: '#c7d5e0',
  },
  map: { height: '100%', width: '100%' },
  actions: { display: 'flex', justifyContent: 'space-between' },
  confirmButton: {
    backgroundColor: '#66c0f4',
    color: '#ffffff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  cancelButton: {
    backgroundColor: '#c7d5e0',
    color: '#1b2838',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default MapModal;
