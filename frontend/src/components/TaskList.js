import React, { useEffect, useState } from 'react';
import { fetchTasks } from '../services/api';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getTasks = async () => {
      try {
        const data = await fetchTasks();
        setTasks(data);
      } catch (err) {
        console.error('Error fetching tasks:', err);
        setError('Failed to fetch tasks. Please try again later.');
      }
    };
    getTasks();
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Task List</h2>
      {error && <p style={styles.error}>{error}</p>}
      <div style={styles.grid}>
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <div key={task._id} style={styles.card}>
              <div style={styles.thumbnail}>
                <h3 style={styles.taskTitle}>{task.title}</h3>
              </div>
              <div style={styles.details}>
                <p style={styles.description}>{task.description}</p>
                <p style={styles.meta}>Difficulty: {task.difficulty}</p>
                <p style={styles.meta}>Status: {task.status}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No tasks available.</p>
        )}
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
  error: {
    color: 'red',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
  },
  card: {
    backgroundColor: '#2a475e',
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
    display: 'flex',
    flexDirection: 'column',
  },
  thumbnail: {
    backgroundColor: '#66c0f4',
    padding: '10px',
    textAlign: 'center',
  },
  taskTitle: {
    color: '#ffffff',
    fontSize: '18px',
    fontWeight: 'bold',
  },
  details: {
    padding: '15px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  description: {
    color: '#c7d5e0',
    fontSize: '14px',
    lineHeight: '1.5',
  },
  meta: {
    color: '#a9b7c6',
    fontSize: '12px',
  },
};

export default TaskList;