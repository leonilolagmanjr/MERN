const taskService = require('../services/taskService');

// Post Task
const postTask = async (req, res) => {
  const { title, description, difficulty } = req.body;
  try {
    const task = await taskService.createTask(title, description, difficulty, req.user);
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Accept Task
const acceptTask = async (req, res) => {
  const taskId = req.params.taskId;
  try {
    const task = await taskService.acceptTask(taskId, req.user);
    res.json({ msg: 'Task accepted successfully', task });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get All Tasks
const getAllTasks = async (req, res) => {
  const { difficulty } = req.query;
  try {
    const tasks = await taskService.getAllTasks(difficulty);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get Tasks Posted by Current User
const getMyPostedTasks = async (req, res) => {
  try {
    const tasks = await taskService.getMyPostedTasks(req.user);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get Tasks Accepted by Current User
const getMyAcceptedTasks = async (req, res) => {
  try {
    const tasks = await taskService.getMyAcceptedTasks(req.user);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Complete Task
const completeTask = async (req, res) => {
  try {
    const task = await taskService.completeTask(req.params.taskId, req.user);
    res.json(task);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Edit Task
const editTask = async (req, res) => {
  const { title, description, difficulty } = req.body;
  try {
    const task = await taskService.editTask(req.params.taskId, title, description, difficulty, req.user);
    res.json(task);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Cancel Task
const cancelTask = async (req, res) => {
  try {
    const task = await taskService.cancelTask(req.params.taskId, req.user);
    res.json({ msg: 'Task canceled' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Delete Task
const deleteTask = async (req, res) => {
  try {
    const task = await taskService.deleteTask(req.params.taskId);
    res.json({msg: 'Task Deleted'});
  } catch (err) {
    res.status(500).json({ msg: 'Server Error'});
  }
};

module.exports = {
  postTask,
  acceptTask,
  getAllTasks,
  getMyPostedTasks,
  getMyAcceptedTasks,
  completeTask,
  editTask,
  cancelTask,
  deleteTask
};
