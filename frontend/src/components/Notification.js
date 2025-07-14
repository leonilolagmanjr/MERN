import React, { useState, useEffect, useContext, useRef } from 'react';
import { getFriendRequests, acceptFriendRequest, denyFriendRequest } from '../services/api';
import { FriendContext } from '../context/FriendContext';

const Notification = () => {
  const [friendRequests, setFriendRequests] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const { notifyFriendListUpdated } = useContext(FriendContext);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchFriendRequests();
  }, []);

  const fetchFriendRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const requests = await getFriendRequests(token);
      setFriendRequests(requests);
    } catch (err) {
      console.error('Error fetching friend requests:', err);
    }
  };

  const handleAccept = async (requesterId) => {
    try {
      const token = localStorage.getItem('token');
      await acceptFriendRequest(requesterId, token);
      setFriendRequests((prev) => prev.filter((req) => req._id !== requesterId));
      notifyFriendListUpdated();
    } catch (err) {
      console.error('Error accepting friend request:', err);
    }
  };

  const handleDeny = async (requesterId) => {
    try {
      const token = localStorage.getItem('token');
      await denyFriendRequest(requesterId, token);
      setFriendRequests((prev) => prev.filter((req) => req._id !== requesterId));
    } catch (err) {
      console.error('Error denying friend request:', err);
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      <button onClick={toggleDropdown} style={styles.bellButton}>
        🔔
        {friendRequests.length > 0 && (
          <span style={styles.badge}>{friendRequests.length}</span>
        )}
      </button>
      {isOpen && (
        <div style={styles.dropdown}>
          <h4 style={styles.heading}>Friend Requests</h4>
          {friendRequests.length === 0 ? (
            <p style={styles.noRequests}>No new friend requests</p>
          ) : (
            friendRequests.map((req) => (
              <div key={req._id} style={styles.requestItem}>
                <span>{req.name} ({req.email})</span>
                <div>
                  <button
                    style={styles.acceptButton}
                    onClick={() => handleAccept(req._id)}
                  >
                    Accept
                  </button>
                  <button
                    style={styles.denyButton}
                    onClick={() => handleDeny(req._id)}
                  >
                    Deny
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  bellButton: {
    position: 'relative',
    background: 'transparent',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#c7d5e0',
  },
  badge: {
    position: 'absolute',
    top: '-5px',
    right: '-5px',
    background: '#ff4c4c',
    borderRadius: '50%',
    color: 'white',
    padding: '2px 6px',
    fontSize: '12px',
  },
  dropdown: {
    position: 'absolute',
    right: 0,
    marginTop: '10px',
    width: '300px',
    backgroundColor: '#171a21',
    border: '1px solid #3a3f4b',
    borderRadius: '5px',
    padding: '10px',
    color: '#c7d5e0',
    zIndex: 1000,
  },
  heading: {
    margin: '0 0 10px 0',
    fontSize: '16px',
    borderBottom: '1px solid #3a3f4b',
    paddingBottom: '5px',
  },
  noRequests: {
    fontStyle: 'italic',
  },
  requestItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
    border: 'none',
    color: 'white',
    padding: '5px 10px',
    marginRight: '5px',
    borderRadius: '3px',
    cursor: 'pointer',
  },
  denyButton: {
    backgroundColor: '#ff4c4c',
    border: 'none',
    color: 'white',
    padding: '5px 10px',
    borderRadius: '3px',
    cursor: 'pointer',
  },
};

export default Notification;
