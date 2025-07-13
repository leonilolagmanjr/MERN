import React, { useState, useEffect } from 'react';
import { fetchTasks } from '../services/api';
import { Link } from 'react-router-dom'; // Import Link for navigation

const BrowseJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredJobs, setFilteredJobs] = useState([]);

  useEffect(() => {
    const fetchAllJobs = async () => {
      try {
        const data = await fetchTasks();
        setJobs(data);
        setFilteredJobs(data);
      } catch (err) {
        console.error('Error fetching jobs:', err);
      }
    };
    fetchAllJobs();
  }, []);

  const handleSearch = () => {
    const filtered = jobs.filter((job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredJobs(filtered);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Browse Jobs</h1>
      <div style={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search jobs by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
        <button onClick={handleSearch} style={styles.searchButton}>
          Search
        </button>
      </div>
      <div style={styles.jobsGrid}>
        {filteredJobs.map((job) => (
          <div key={job._id} style={styles.jobCard}>
            <h3 style={styles.jobTitle}>
              <Link to={`/job/${job._id}`} style={styles.link}>
                {job.title}
              </Link>
            </h3>
            <p style={styles.jobDescription}>{job.description}</p>
            <p style={styles.jobMeta}>Difficulty: {job.difficulty}</p>
            <p style={styles.jobMeta}>Category: {job.category}</p>
            <p style={styles.jobMeta}>Location: {job.location}</p>
            <p style={styles.jobMeta}>Deadline: {new Date(job.deadline).toLocaleDateString()}</p>
          </div>
        ))}
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
    color: '#ffffff',
    marginBottom: '20px',
  },
  searchContainer: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
  },
  searchInput: {
    flex: 1,
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #66c0f4',
    backgroundColor: '#2a475e',
    color: '#c7d5e0',
  },
  searchButton: {
    padding: '10px 20px',
    borderRadius: '5px',
    backgroundColor: '#66c0f4',
    color: '#ffffff',
    border: 'none',
    cursor: 'pointer',
  },
  jobsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
  },
  jobCard: {
    backgroundColor: '#2a475e',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
  },
  jobTitle: {
    color: '#ffffff',
    marginBottom: '10px',
  },
  jobDescription: {
    color: '#c7d5e0',
    marginBottom: '10px',
  },
  jobMeta: {
    color: '#a9b7c6',
    fontSize: '14px',
  },
  link: {
    color: '#66c0f4',
    textDecoration: 'none',
  },
};

export default BrowseJobs;