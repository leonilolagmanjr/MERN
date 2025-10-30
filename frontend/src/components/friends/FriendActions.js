import React, { useState } from 'react';
import {
  sendFriendRequest,
  acceptFriendRequest,
  denyFriendRequest,
  cancelFriendRequest,
  getFriendRequests,
  removeFriend
} from '../../services/api';
import UserLink from '../UserLink';

const FriendActions = ({
  userId,
  isCurrentUser,
  isFriend,
  requestSent,
  hasPendingRequest,
  loadingFriendStatus,
  openChatWithUser,
  updateFriendStatus,
  notifyFriendListUpdated,
  friendRequests = [], // for current user
  styles = {}
}) => {
  const [loading, setLoading] = useState(false);

  // Handlers for friend actions
  const handleSendFriendRequest = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await sendFriendRequest(userId, token);
      notifyFriendListUpdated();
      await updateFriendStatus();
    } catch (err) {
      console.error('Error sending friend request:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelFriendRequest = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await cancelFriendRequest(userId, token);
      notifyFriendListUpdated();
      await updateFriendStatus();
    } catch (err) {
      console.error('Error canceling friend request:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (requesterId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await acceptFriendRequest(requesterId, token);
      notifyFriendListUpdated();
      await updateFriendStatus();
    } catch (err) {
      console.error('Error accepting friend request:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDenyRequest = async (requesterId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await denyFriendRequest(requesterId, token);
      notifyFriendListUpdated();
      await updateFriendStatus();
    } catch (err) {
      console.error('Error denying friend request:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFriend = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await removeFriend(userId, token);
      notifyFriendListUpdated();
      await updateFriendStatus();
    } catch (err) {
      console.error('Error removing friend:', err);
    } finally {
      setLoading(false);
    }
  };

  // UI for current user: show incoming friend requests
  if (isCurrentUser) {
    return (
      <>
        {friendRequests.length > 0 && (
          <div style={styles.friendRequestsSection}>
            <h2 style={styles.sectionHeading}>Friend Requests</h2>
            {friendRequests.map((req) => (
              <div key={req._id} style={styles.friendRequestItem}>
                <p><UserLink userId={req._id} name={req.name} /> ({req.email})</p>
                <button
                  style={styles.acceptButton}
                  onClick={() => handleAcceptRequest(req._id)}
                  disabled={loading}
                >
                  Accept
                </button>
                <button
                  style={styles.denyButton}
                  onClick={() => handleDenyRequest(req._id)}
                  disabled={loading}
                >
                  Deny
                </button>
              </div>
            ))}
          </div>
        )}
      </>
    );
  }

  // UI for other users: friend actions
  if (loadingFriendStatus || loading) {
    return <button style={styles.addFriendButton} disabled>Loading...</button>;
  }
  if (isFriend) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <button
          style={styles.messageButton}
          onClick={() => openChatWithUser(userId)}
        >
          Message
        </button>
        <button
          style={{ ...styles.addFriendButton, backgroundColor: 'var(--color-error)' }}
          onClick={handleRemoveFriend}
          disabled={loading}
        >
          Remove Friend
        </button>
      </div>
    );
  }
  if (requestSent) {
    return (
      <>
        <button style={styles.addFriendButton} disabled>Request Sent</button>
        <button
          style={{ ...styles.addFriendButton, marginLeft: '10px', backgroundColor: 'var(--color-error)' }}
          onClick={handleCancelFriendRequest}
          disabled={loading}
        >
          Cancel Request
        </button>
      </>
    );
  }
  if (hasPendingRequest) {
    return <button style={styles.addFriendButton} disabled>Request Pending</button>;
  }
  return (
    <button
      style={styles.addFriendButton}
      onClick={handleSendFriendRequest}
      disabled={loading}
    >
      Add Friend
    </button>
  );
};

export default FriendActions;
