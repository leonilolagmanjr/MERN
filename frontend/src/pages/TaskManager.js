import React, { useState } from 'react';
import CreateTask from '../components/tasks/CreateTask';
import UpdateTask from '../components/tasks/UpdateTask';
import DeleteTask from '../components/tasks/DeleteTask';
import ReadTask from '../components/tasks/ReadTask'; // Updated import

const TaskManager = () => {
  const [refreshTasks, setRefreshTasks] = useState(false);

  const triggerRefresh = () => {
    setRefreshTasks(!refreshTasks);
  };

  return (
    <div style={styles.pageContainer}>
      {/* Sidebar Container */}
      <div style={styles.sidebar}>
        <h2 style={styles.heading}>Task Manager</h2>
        <CreateTask onTaskCreated={triggerRefresh} />
        <UpdateTask onTaskUpdated={triggerRefresh} />
        <DeleteTask onTaskDeleted={triggerRefresh} />
      </div>

      {/* Main Body Container */}
      <div style={styles.body}>
        <ReadTask refresh={refreshTasks} />
      </div>
    </div>
  );
};

const styles = {
  pageContainer: {
    display: 'flex',
    flexDirection: 'row',
    height: '105vh',
    backgroundColor: '#1b2838',
    color: '#c7d5e0',
  },
  sidebar: {
    width: '300px',
    padding: '20px',
    backgroundColor: '#2a475e',
    borderRight: '1px solid #c7d5e0',
    boxShadow: '2px 0 6px rgba(0, 0, 0, 0.2)',
  },
  body: {
    flex: 1,
    padding: '20px',
    overflowY: 'auto',
  },
  heading: {
    color: '#ffffff',
    marginBottom: '20px',
  },
};

export default TaskManager;