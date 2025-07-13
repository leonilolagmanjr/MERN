import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchTasks } from '../services/api';

const Job = () => {
  const { jobId } = useParams(); // Get job ID from the URL
  const [job, setJob] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const tasks = await fetchTasks(); // Fetch all tasks
        const selectedJob = tasks.find((task) => task._id === jobId); // Find the specific job
        if (selectedJob) {
          setJob(selectedJob);
        } else {
          setError('Job not found');
        }
      } catch (err) {
        console.error('Error fetching job details:', err);
        setError('Failed to fetch job details');
      }
    };
    fetchJobDetails();
  }, [jobId]);

  if (error) {
    return <div style={styles.error}>{error}</div>;
  }

  if (!job) {
    return <div style={styles.loading}>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>{job.title}</h1>
      <p style={styles.description}>{job.description}</p>
      <p style={styles.meta}>Difficulty: {job.difficulty}</p>
      <p style={styles.meta}>Category: {job.category}</p>
      <p style={styles.meta}>Location: {job.location}</p>
      <p style={styles.meta}>Deadline: {new Date(job.deadline).toLocaleDateString()}</p>
      <p style={styles.meta}>Status: {job.status}</p>
      <p style={styles.meta}>Posted by: {job.createdBy}</p>
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
  description: {
    color: '#c7d5e0',
    marginBottom: '10px',
  },
  meta: {
    color: '#a9b7c6',
    fontSize: '14px',
    marginBottom: '5px',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: '20px',
  },
  loading: {
    color: '#c7d5e0',
    textAlign: 'center',
    marginTop: '20px',
  },
};

export default Job;