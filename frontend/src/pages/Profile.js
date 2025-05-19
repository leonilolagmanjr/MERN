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

      {/* Main Content Section */}
      <div style={styles.mainContent}>
        {/* Left Column */}
        <div style={styles.leftColumn}>
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

          {/* Post Box Section */}
          <div style={styles.postBox}>
            <textarea
              style={styles.postInput}
              placeholder="Share your thoughts, updates, or job details..."
            ></textarea>
            <div style={styles.postActions}>
              <button style={styles.postButton}>Post</button>
            </div>
          </div>
        </div>

        {/* Right Column */}
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
  mainContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start', // Aligns the columns at the top
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
    marginTop: '-250px', // Adjust this value to align with the avatar
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
  sidebarLinks: {
    fontSize: '14px',
    color: '#c7d5e0',
    lineHeight: '1.8',
  },
  postBox: {
    backgroundColor: '#171a21',
    padding: '20px', // Ensures spacing inside the postBox
    borderRadius: '10px',
    marginTop: '30px',
    color: '#c7d5e0',
  },
  postInput: {
    width: '100%', // Takes full width of the postBox minus padding
    height: '100px',
    backgroundColor: '#2a475e',
    border: 'none',
    borderRadius: '5px',
    padding: '10px',
    color: '#c7d5e0',
    fontSize: '14px',
    resize: 'none', // Prevents resizing
    boxSizing: 'border-box', // Includes padding in width calculation
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