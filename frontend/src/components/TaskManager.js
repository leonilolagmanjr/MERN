import React, { useState } from 'react';
import TaskList from './TaskList';
import CreateTask from './tasks/CreateTask';
import UpdateTask from './tasks/UpdateTask';
import DeleteTask from './tasks/DeleteTask';

const TaskManager = () => {
  const [refreshTasks, setRefreshTasks] = useState(false);

  const triggerRefresh = () => {
    setRefreshTasks(!refreshTasks);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Task Manager</h2>
      <CreateTask onTaskCreated={triggerRefresh} />
      <TaskList refresh={refreshTasks} />
      <UpdateTask onTaskUpdated={triggerRefresh} />
      <DeleteTask onTaskDeleted={triggerRefresh} />
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#1b2838',
    color: '#c7d5e0',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
  },
  heading: {
    color: '#ffffff',
    marginBottom: '20px',
  },
};

export default TaskManager;