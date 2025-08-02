import React, { useEffect, useState } from 'react';
import { fetchPostedJobs, deleteTask } from '../../services/api';
import { Box, Typography, Grid, Card, CardContent, Button } from '@mui/material';

const ReadTask = ({ refresh }) => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const getTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        const data = await fetchPostedJobs(token);
        setTasks(data);
      } catch (err) {
        console.error('Error fetching tasks:', err);
      }
    };
    getTasks();
  }, [refresh]);

  const handleDelete = async (taskId) => {
    try {
      const token = localStorage.getItem('token');
      await deleteTask(taskId, token);
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId)); // Remove the task from the list
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" sx={{ mb: 2, color: '#ffffff' }}>
        My Posted Tasks
      </Typography>
      <Grid container spacing={3}>
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <Grid item xs={12} sm={6} md={4} key={task._id}>
              <Card
                sx={{
                  bgcolor: '#2a475e',
                  color: '#c7d5e0',
                  borderRadius: 2,
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
                  position: 'relative',
                }}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ color: '#ffffff', mb: 1 }}>
                    {task.title}
                  </Typography>
                  <Typography sx={{ mb: 1 }}>{task.description}</Typography>
                  <Typography variant="body2" sx={{ color: '#a9b7c6' }}>
                    Difficulty: {task.difficulty}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#a9b7c6' }}>
                    Status: {task.status}
                  </Typography>
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    sx={{ position: 'absolute', top: 10, right: 10 }}
                    onClick={() => handleDelete(task._id)}
                  >
                    Remove
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="body1" sx={{ color: '#c7d5e0' }}>
            No tasks available.
          </Typography>
        )}
      </Grid>
    </Box>
  );
};

export default ReadTask;