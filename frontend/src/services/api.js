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

// User APIs
export const getUserProfile = async (token) => {
  const response = await axios.get(`${API_URL}/user/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};