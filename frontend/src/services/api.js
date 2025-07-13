import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Backend URL

// Authentication APIs
export const registerUser = async (userData) => {
  const response = await axios.post(`${API_URL}/auth/register`, userData);
  return response.data;
};

export const loginUser = async (userData) => {
  const response = await axios.post(`${API_URL}/auth/login`, userData);
  return response.data;
};

// Task APIs
export const fetchTasks = async () => {
  const response = await axios.get(`${API_URL}/task/list`);
  return response.data;
};

export const postTask = async (taskData, token) => {
  const response = await axios.post(`${API_URL}/task/post`, taskData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const fetchPostedJobs = async (token) => {
  const response = await axios.get(`${API_URL}/task/my-posted`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const fetchCompletedJobs = async (token) => {
  const response = await axios.get(`${API_URL}/task/my-completed`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const fetchAcceptedJobs = async (token) => {
  const response = await axios.get(`${API_URL}/task/my-accepted`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// User APIs
export const getUserProfile = async (userId, token) => {
  const response = await axios.get(`${API_URL}/user/profile/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateUserProfile = async (profileData, token) => {
  const response = await axios.patch(`${API_URL}/user/updateprofile`, profileData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Edit and Delete Task APIs
export const editTask = async (taskId, data, token) => {
  return await axios.patch(`${API_URL}/task/edit/${taskId}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const deleteTask = async (taskId, token) => {
  return await axios.delete(`${API_URL}/task/remove/${taskId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Fetch Info
export const fetchInfo = async (token) => {
  const response = await axios.get(`${API_URL}/info`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Update Info
export const updateInfo = async (token, updatedInfo) => {
  const response = await axios.patch(`${API_URL}/info/update`, updatedInfo, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const addUserConnection = async (email, token) => {
  try {
    const response = await axios.post(
      '/api/users/add-connection',
      { email },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.connections; // Assuming the backend returns the updated connections list
  } catch (error) {
    console.error('Error adding user connection:', error);
    throw error;
  }
};