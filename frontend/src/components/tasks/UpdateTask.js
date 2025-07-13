import React, { useState, useEffect } from 'react';
import { editTask, fetchPostedJobs } from '../../services/api';

const UpdateTask = ({ onTaskUpdated }) => {
  const [tasks, setTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: '',
    category: '',
    location: '',
    deadline: '',
  });
  const [message, setMessage] = useState('');

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const postedTasks = await fetchPostedJobs(token);
      setTasks(postedTasks); // <- this is what updates the dropdown options
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };
  
  useEffect(() => {
    fetchTasks();
  }, []);
  

  const handleTaskChange = (e) => {
    const taskId = e.target.value;
    setSelectedTaskId(taskId);
    const selectedTask = tasks.find((task) => task._id === taskId);
    if (selectedTask) {
      setFormData({
        title: selectedTask.title,
        description: selectedTask.description,
        difficulty: selectedTask.difficulty,
        category: selectedTask.category,
        location: selectedTask.location,
        deadline: selectedTask.deadline.split('T')[0], // Format date
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await editTask(selectedTaskId, formData, token);
      setMessage('Task updated successfully!');
      setSelectedTaskId('');
      setFormData({
        title: '',
        description: '',
        difficulty: '',
        category: '',
        location: '',
        deadline: '',
      });
      await fetchTasks();
      onTaskUpdated();
    } catch (err) {
      setMessage('Failed to update task. Please try again.');
    }
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.heading}>Update Task</h3>
      {message && <p style={styles.message}>{message}</p>}
      <form style={styles.form} onSubmit={handleSubmit}>
        <select
          value={selectedTaskId}
          onChange={handleTaskChange}
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
        <input
          type="text"
          placeholder="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          style={styles.input}
        />
        <textarea
          placeholder="Description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          style={styles.textarea}
        />
        <input
          type="text"
          placeholder="Difficulty"
          value={formData.difficulty}
          onChange={(e) =>
            setFormData({ ...formData, difficulty: e.target.value })
          }
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Category"
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Location"
          value={formData.location}
          onChange={(e) =>
            setFormData({ ...formData, location: e.target.value })
          }
          style={styles.input}
        />
        <input
          type="date"
          value={formData.deadline}
          onChange={(e) =>
            setFormData({ ...formData, deadline: e.target.value })
          }
          style={styles.input}
        />
        <button type="submit" style={styles.button}>
          Update Task
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
  textarea: {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #66c0f4',
    backgroundColor: '#1b2838',
    color: '#c7d5e0',
    resize: 'none',
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

export default UpdateTask;