import React, { useState, useEffect } from 'react';
import { deleteTask, fetchPostedJobs } from '../../services/api';

const DeleteTask = ({ onTaskDeleted }) => {
  const [tasks, setTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        const postedTasks = await fetchPostedJobs(token);
        setTasks(postedTasks);
      } catch (err) {
        console.error('Error fetching tasks:', err);
      }
    };
    fetchTasks();
  }, []);

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await deleteTask(selectedTaskId, token);
      setMessage('Task deleted successfully!');
      setSelectedTaskId('');
      onTaskDeleted();
    } catch (err) {
      setMessage('Failed to delete task. Please try again.');
    }
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.heading}>Delete Task</h3>
      {message && <p style={styles.message}>{message}</p>}
      <form style={styles.form} onSubmit={handleDelete}>
        <select
          value={selectedTaskId}
          onChange={(e) => setSelectedTaskId(e.target.value)}
          style={styles.input}
          required
        >
          <option value="">Select a task</option>
          {tasks.map((task) => (
            <option key={task._id} value={task._id}>
              {task.title}
            </option>
          ))}
        </select>
        <button type="submit" style={styles.button}>
          Delete Task
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    marginBottom: '20px',
  },
  heading: {
    color: '#ffffff',
    marginBottom: '10px',
  },
  message: {
    color: '#66c0f4',
    marginBottom: '10px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  input: {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #66c0f4',
    backgroundColor: '#1b2838',
    color: '#c7d5e0',
  },
  button: {
    backgroundColor: '#66c0f4',
    color: '#ffffff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default DeleteTask;