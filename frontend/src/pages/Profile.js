import React, { useEffect, useState } from 'react';
import { fetchPostedJobs, fetchCompletedJobs, fetchAcceptedJobs, getUserProfile } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({});
  const [postedJobs, setPostedJobs] = useState([]);
  const [completedJobs, setCompletedJobs] = useState([]);
  const [acceptedJobs, setAcceptedJobs] = useState([]);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem('token');
        const profileData = await getUserProfile(token);
        setProfile(profileData);

        const posted = await fetchPostedJobs(token);
        const completed = await fetchCompletedJobs(token);
        const accepted = await fetchAcceptedJobs(token);

        setPostedJobs(posted);
        setCompletedJobs(completed);
        setAcceptedJobs(accepted);
      } catch (err) {
        console.error('Error fetching profile data:', err);
      }
    };

    fetchProfileData();
  }, []);

  return (
    <div style={styles.container}>
      {/* Header Section */}
      <div style={styles.header}>
        <div style={styles.profileImageContainer}>
          <img
            src={profile.profileImage || 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.kindpng.com%2Fpicc%2Fm%2F722-7221920_placeholder-profile-image-placeholder-png-transparent-png.png&f=1&nofb=1&ipt=13d4c6fb7215466f2b101d2e250b152a1f29f1fcd31d3822007d4d56e0982eb1'}
            alt="User"
            style={styles.profileImage}
          />
        </div>
        <div style={styles.userInfo}>
          <h1 style={styles.userName}>{profile.name || 'User Name'}</h1>
          <p style={styles.userDetails}>Country: {profile.country || 'Unknown'}</p>
          <p style={styles.userDetails}>ID: {profile.id || 'N/A'}</p>
          <p style={styles.userDetails}>Level: {profile.level || 1}</p>
          <button style={styles.editButton}>Edit Profile</button>
        </div>
      </div>

      {/* Steam Replay Section */}
      <div style={styles.steamReplay}>
        <h2 style={styles.sectionHeading}>Steam Replay 2023</h2>
        <div style={styles.replayStats}>
          <div style={styles.statBox}>
            <h3 style={styles.statNumber}>53</h3>
            <p style={styles.statLabel}>Games Played</p>
          </div>
          <div style={styles.statBox}>
            <h3 style={styles.statNumber}>1,441</h3>
            <p style={styles.statLabel}>Sessions</p>
          </div>
          <div style={styles.statBox}>
            <h3 style={styles.statNumber}>290</h3>
            <p style={styles.statLabel}>Achievements</p>
          </div>
          <div style={styles.statBox}>
            <h3 style={styles.statNumber}>11</h3>
            <p style={styles.statLabel}>New Games</p>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div style={styles.recentActivity}>
        <h2 style={styles.sectionHeading}>Recent Activity</h2>
        <p style={styles.activitySummary}>79.8 hours past 2 weeks</p>
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

      {/* Sidebar Section */}
      <div style={styles.sidebar}>
        <div style={styles.levelBox}>
          <h3 style={styles.levelTitle}>Level {profile.level || 1}</h3>
          <p style={styles.xp}>500 XP</p>
        </div>
        <div style={styles.badges}>
          <h3 style={styles.badgesTitle}>Badges</h3>
          <p>9 Badges</p>
        </div>
        <div style={styles.sidebarLinks}>
          <p>Games: 118</p>
          <p>Inventory</p>
          <p>Screenshots</p>
          <p>Videos</p>
          <p>Workshop Items</p>
          <p>Reviews</p>
          <p>Guides</p>
          <p>Artwork</p>
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
  steamReplay: {
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
  sidebar: {
    marginTop: '30px',
    backgroundColor: '#171a21',
    padding: '20px',
    borderRadius: '10px',
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
  sidebarLinks: {
    fontSize: '14px',
    color: '#c7d5e0',
    lineHeight: '1.8',
  },
};

export default Profile;