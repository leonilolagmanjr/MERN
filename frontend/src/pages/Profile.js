import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  fetchPostedJobs,
  fetchCompletedJobs,
  fetchAcceptedJobs,
  getUserProfile,
  sendFriendRequest,
  getFriendRequests,
  acceptFriendRequest,
  denyFriendRequest,
  cancelFriendRequest
} from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useFriend } from '../context/FriendContext';
import Posts from '../components/posts/Posts';
import FriendActions from '../components/friends/FriendActions';

const Profile = () => {
  const { userId } = useParams();
  const { user } = useAuth();
  const { getFriendStatus, notifyFriendListUpdated, openChatWithUser, friendRequests } = useFriend();

  const [profile, setProfile] = useState({});
  const [postedJobs, setPostedJobs] = useState([]);
  const [completedJobs, setCompletedJobs] = useState([]);
  const [acceptedJobs, setAcceptedJobs] = useState([]);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [requestSent, setRequestSent] = useState(null);
  const [isFriend, setIsFriend] = useState(null);
  const [hasPendingRequest, setHasPendingRequest] = useState(null);
  const [loadingFriendStatus, setLoadingFriendStatus] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem('token');
        const viewedProfile = await getUserProfile(userId, token);

        setProfile(viewedProfile);
        setIsCurrentUser(userId === user?.id);

        const [posted, completed, accepted] = await Promise.all([
          fetchPostedJobs(userId, token),
          fetchCompletedJobs(userId, token),
          fetchAcceptedJobs(userId, token),
        ]);

        setPostedJobs(posted);
        setCompletedJobs(completed);
        setAcceptedJobs(accepted);

        // Always check friend status when profile is visited
        await updateFriendStatus();
      } catch (err) {
        console.error('Error fetching profile data:', err);
      } finally {
        setLoadingFriendStatus(false);
      }
    };

    if (user?.id) {
      fetchProfileData();
    }
  }, [userId, user, getFriendStatus]);

  // New function to update friend status
  const updateFriendStatus = async () => {
    try {
      const status = await getFriendStatus(userId);
      setIsFriend(status === 'friends');
      setRequestSent(status === 'requestSent');
      setHasPendingRequest(status === 'requestReceived');

      if (userId === user?.id) {
        const token = localStorage.getItem('token');
        const requests = await getFriendRequests(token);
        setHasPendingRequest(false);
        setRequestSent(false);
        setIsFriend(false);
      }
    } catch (err) {
      console.error('Error updating friend status:', err);
    }
  };

  // Listen for friendRequests or friend list updates to refresh friend status in real time
  useEffect(() => {
    updateFriendStatus();
  }, [friendRequests, userId, user]);

  const handleSendFriendRequest = async () => {
    try {
      const token = localStorage.getItem('token');
      await sendFriendRequest(userId, token);
      notifyFriendListUpdated();
      // Update friend status after sending request
      await updateFriendStatus();
    } catch (err) {
      console.error('Error sending friend request:', err);
    }
  };

  const handleAcceptRequest = async (requesterId) => {
    try {
      const token = localStorage.getItem('token');
      await acceptFriendRequest(requesterId, token);
      notifyFriendListUpdated();
      // Update friend status after accepting request
      await updateFriendStatus();
    } catch (err) {
      console.error('Error accepting friend request:', err);
    }
  };

  const handleDenyRequest = async (requesterId) => {
    try {
      const token = localStorage.getItem('token');
      await denyFriendRequest(requesterId, token);
      notifyFriendListUpdated();
      // Update friend status after denying request
      await updateFriendStatus();
    } catch (err) {
      console.error('Error denying friend request:', err);
    }
  };

  const handleCancelFriendRequest = async () => {
    try {
      const token = localStorage.getItem('token');
      await cancelFriendRequest(userId, token);
      notifyFriendListUpdated();
      // Update friend status after canceling request
      await updateFriendStatus();
    } catch (err) {
      console.error('Error canceling friend request:', err);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.profileImageContainer}>
          <img
            src={profile.profileImage || 'https://www.kindpng.com/picc/m/722-7221920_placeholder-profile-image-placeholder-png-transparent-png.png'}
            alt="User"
            style={styles.profileImage}
          />
        </div>
        <div style={styles.userInfo}>
          <h1 style={styles.userName}>{profile.name || 'User Name'}</h1>
          <p style={styles.userDetails}>Email: {profile.email || 'Unknown'}</p>
          <p style={styles.userDetails}>ID: {profile.id || 'N/A'}</p>
          <p style={styles.userDetails}>Level: {profile.level || 1}</p>
          <p>  </p>
          {isCurrentUser ? (
            <>
              <button style={styles.editButton} onClick={() => window.location.href = '/editprofile'}>Edit Profile</button>
              <FriendActions
                userId={userId}
                isCurrentUser={isCurrentUser}
                isFriend={isFriend}
                requestSent={requestSent}
                hasPendingRequest={hasPendingRequest}
                loadingFriendStatus={loadingFriendStatus}
                openChatWithUser={openChatWithUser}
                updateFriendStatus={updateFriendStatus}
                notifyFriendListUpdated={notifyFriendListUpdated}
                friendRequests={friendRequests}
                styles={styles}
              />
            </>
          ) : (
            <FriendActions
              userId={userId}
              isCurrentUser={isCurrentUser}
              isFriend={isFriend}
              requestSent={requestSent}
              hasPendingRequest={hasPendingRequest}
              loadingFriendStatus={loadingFriendStatus}
              openChatWithUser={openChatWithUser}
              updateFriendStatus={updateFriendStatus}
              notifyFriendListUpdated={notifyFriendListUpdated}
              styles={styles}
            />
          )}
        </div>
      </div>

      <div style={styles.mainContent}>
        <div style={styles.leftColumn}>
          {isCurrentUser && friendRequests.length > 0 && (
            <div style={styles.friendRequestsSection}>
              <h2 style={styles.sectionHeading}>Friend Requests</h2>
              {friendRequests.map((req) => (
                <div key={req._id} style={styles.friendRequestItem}>
                  <p>
                    <Link to={`/profile/${req._id}`} style={{ color: '#66c0f4', textDecoration: 'none' }}>
                      {req.name}
                    </Link> ({req.email})
                  </p>
                  <button
                    style={styles.acceptButton}
                    onClick={() => handleAcceptRequest(req._id)}
                  >
                    Accept
                  </button>
                  <button
                    style={styles.denyButton}
                    onClick={() => handleDenyRequest(req._id)}
                  >
                    Deny
                  </button>
                </div>
              ))}
            </div>
          )}
          {isCurrentUser && profile.connections && profile.connections.length > 0 && (
            <div style={styles.friendListSection}>
              <h2 style={styles.sectionHeading}>Friend List</h2>
              <details>
                <summary style={styles.summary}>Show Friends ({profile.connections.length})</summary>
                <ul style={styles.friendList}>
                  {profile.connections.map((friend) => (
                    <li key={friend._id} style={styles.friendListItem}>
                      <Link to={`/profile/${friend._id}`} style={{ color: '#66c0f4', textDecoration: 'none' }}>
                        {friend.name}
                      </Link> ({friend.email})
                    </li>
                  ))}
                </ul>
              </details>
            </div>
          )}

          <div style={styles.accomplishments}>
            <h2 style={styles.sectionHeading}>Accomplishments</h2>
            <div style={styles.replayStats}>
              <div style={styles.statBox}>
                <h3 style={styles.statNumber}>{completedJobs.length}</h3>
                <p style={styles.statLabel}>Jobs Completed</p>
              </div>
              <div style={styles.statBox}>
                <h3 style={styles.statNumber}>{postedJobs.length}</h3>
                <p style={styles.statLabel}>Jobs Posted</p>
              </div>
              <div style={styles.statBox}>
                <h3 style={styles.statNumber}>{profile.experience || 0}</h3>
                <p style={styles.statLabel}>Earned Experience</p>
              </div>
            </div>
          </div>

          <div style={styles.recentActivity}>
            <div style={styles.activityList}>
              {completedJobs.map((job) => (
                <div key={job._id} style={styles.activityItem}>
                  <h3 style={styles.activityTitle}>{job.title}</h3>
                  <p style={styles.activityDetails}>{job.description}</p>
                  <p style={styles.activityMeta}>Completed on: {new Date(job.updatedAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={styles.postsSection}>
            <h2 style={styles.sectionHeading}>Posts</h2>
            <Posts userId={userId} />
          </div>
        </div>

        <div style={styles.rightColumn}>
          <div style={styles.levelBox}>
            <h3 style={styles.levelTitle}>Level {profile.level || 1}</h3>
            <p style={styles.xp}>{profile.experience || 0} XP</p>
          </div>
          <div style={styles.badges}>
            <h3 style={styles.badgesTitle}>Badges</h3>
            <p>{profile.badges?.length || 0} Badges</p>
          </div>
          <div style={styles.sidebarSection}>
            <h3 style={styles.sidebarHeading}>Basic Information</h3>
            <p>Full Name: {profile.name || 'N/A'}</p>
            <p>Email Address: {profile.email || 'N/A'}</p>
            <p>Phone Number: {profile.phone || 'N/A'}</p>
            <p>Location: {profile.location || 'N/A'}</p>
            <p>Remote Availability: {profile.remoteAvailability ? 'Yes' : 'No'}</p>
          </div>
          <div style={styles.sidebarSection}>
            <h3 style={styles.sidebarHeading}>Professional Details</h3>
            <p>Job Title: {profile.jobTitle || 'N/A'}</p>
            <p>Industry: {profile.industry || 'N/A'}</p>
            <p>Years of Experience: {profile.experienceYears || 'N/A'}</p>
            <p>Employment Type: {profile.employmentType || 'N/A'}</p>
          </div>
          <div style={styles.sidebarSection}>
            <h3 style={styles.sidebarHeading}>Skills and Certifications</h3>
            <p>Skills: {profile.skills?.join(', ') || 'N/A'}</p>
            <p>Languages: {profile.languages?.join(', ') || 'N/A'}</p>
            <p>Certifications: {profile.certifications?.join(', ') || 'N/A'}</p>
          </div>
          <div style={styles.sidebarSection}>
            <h3 style={styles.sidebarHeading}>Work Portfolio</h3>
            <p>Resume: <a href={profile.resumeLink || '#'} target="_blank" rel="noopener noreferrer">View</a></p>
            <p>Portfolio: <a href={profile.portfolioLink || '#'} target="_blank" rel="noopener noreferrer">View</a></p>
          </div>
          <div style={styles.sidebarSection}>
            <h3 style={styles.sidebarHeading}>Ratings and Performance</h3>
            <p>Average Rating: {profile.rating || 'N/A'}</p>
            <p>Job Success Rate: {profile.successRate || 'N/A'}%</p>
            <p>Completed Jobs: {completedJobs.length}</p>
          </div>
          <div style={styles.sidebarSection}>
            <h3 style={styles.sidebarHeading}>Rates and Payment</h3>
            <p>Hourly Rate: ${profile.hourlyRate || 'N/A'}</p>
            <p>Preferred Payment Method: {profile.paymentMethod || 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#1b2838',
    color: '#c7d5e0',
    padding: '20px',
    minHeight: '100vh',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '30px',
  },
  profileImageContainer: {
    marginRight: '20px',
  },
  profileImage: {
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    border: '3px solid #66c0f4',
  },
  userInfo: {
    color: '#ffffff',
  },
  userName: {
    fontSize: '24px',
    marginBottom: '10px',
  },
  userDetails: {
    fontSize: '16px',
    marginBottom: '5px',
  },
  editButton: {
    backgroundColor: '#66c0f4',
    color: '#ffffff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  addFriendButton: {
    backgroundColor: '#4CAF50',
    color: '#ffffff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  mainContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  leftColumn: {
    flex: 3,
    marginRight: '20px',
  },
  rightColumn: {
    flex: 1,
    backgroundColor: '#171a21',
    padding: '20px',
    borderRadius: '10px',
    marginTop: '-250px',
  },
  accomplishments: {
    marginBottom: '30px',
  },
  sectionHeading: {
    fontSize: '20px',
    marginBottom: '15px',
    color: '#66c0f4',
  },
  replayStats: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  statBox: {
    textAlign: 'center',
    backgroundColor: '#2a475e',
    padding: '20px',
    borderRadius: '10px',
    flex: 1,
    margin: '0 10px',
  },
  statNumber: {
    fontSize: '24px',
    color: '#ffffff',
  },
  statLabel: {
    fontSize: '14px',
    color: '#c7d5e0',
  },
  recentActivity: {
    marginBottom: '30px',
  },
  activitySummary: {
    fontSize: '16px',
    marginBottom: '15px',
  },
  activityList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
  },
  activityItem: {
    backgroundColor: '#2a475e',
    padding: '15px',
    borderRadius: '10px',
  },
  activityTitle: {
    fontSize: '18px',
    color: '#ffffff',
    marginBottom: '10px',
  },
  activityDetails: {
    fontSize: '14px',
    color: '#c7d5e0',
    marginBottom: '10px',
  },
  activityMeta: {
    fontSize: '12px',
    color: '#a9b7c6',
  },
  levelBox: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  levelTitle: {
    fontSize: '20px',
    color: '#66c0f4',
  },
  xp: {
    fontSize: '14px',
    color: '#c7d5e0',
  },
  badges: {
    marginBottom: '20px',
  },
  badgesTitle: {
    fontSize: '16px',
    color: '#66c0f4',
    marginBottom: '10px',
  },
  sidebarSection: {
    marginBottom: '20px',
  },
  sidebarHeading: {
    fontSize: '16px',
    color: '#66c0f4',
    marginBottom: '10px',
  },
  postBox: {
    backgroundColor: '#171a21',
    padding: '20px',
    borderRadius: '10px',
    marginTop: '30px',
    color: '#c7d5e0',
  },
  postInput: {
    width: '100%',
    height: '100px',
    backgroundColor: '#2a475e',
    border: 'none',
    borderRadius: '5px',
    padding: '10px',
    color: '#c7d5e0',
    fontSize: '14px',
    resize: 'none',
    boxSizing: 'border-box',
    marginBottom: '10px',
  },
  postActions: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  postButton: {
    backgroundColor: '#66c0f4',
    color: '#ffffff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
  },
};

export default Profile;
