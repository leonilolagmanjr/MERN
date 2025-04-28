const Task = require('../models/Task');

// Create Task
const createTask = async (title, description, difficulty, createdBy) => {
  try {
    const task = new Task({
      title,
      description,
      difficulty,
      createdBy,  // Changed from posterId to createdBy
    });
    await task.save();
    return task;
  } catch (err) {
    throw new Error('Error creating task');
  }
};

// Accept Task
const acceptTask = async (taskId, assignedTo) => {  // Changed doerId to assignedTo
  try {
    const task = await Task.findById(taskId);
    if (!task) throw new Error('Task not found');
    if (task.createdBy.toString() === assignedTo.toString()) throw new Error('Cannot Accept Own Task');  // Replaced posterId with createdBy
    if (task.status !== 'open') throw new Error('Task is no longer available');
    task.status = 'in-progress';
    task.assignedTo = assignedTo;  // Replaced doerId with assignedTo
    await task.save();
    return task;
  } catch (err) {
    throw new Error('Error accepting task');
  }
};

// Get All Tasks
const getAllTasks = async (difficulty) => {
  try {
    const filter = difficulty ? { status: 'open', difficulty } : { status: 'open' };
    const tasks = await Task.find(filter);
    return tasks;
  } catch (err) {
    throw new Error('Error fetching tasks');
  }
};

// Get Tasks Posted by Current User
const getMyPostedTasks = async (userId) => {
  try {
    const tasks = await Task.find({ createdBy: userId });  // Changed posterId to createdBy
    return tasks;
  } catch (err) {
    throw new Error('Error fetching tasks');
  }
};

// Get Tasks Accepted by Current User
const getMyAcceptedTasks = async (userId) => {
  try {
    const tasks = await Task.find({ assignedTo: userId });  // Changed doerId to assignedTo
    return tasks;
  } catch (err) {
    throw new Error('Error fetching tasks');
  }
};

// Complete Task
const completeTask = async (taskId, assignedTo) => {  // Changed doerId to assignedTo
  try {
    const task = await Task.findById(taskId);
    if (!task) throw new Error('Task not found');
    if (String(task.assignedTo) !== assignedTo) throw new Error('Not authorized to complete this task');  // Replaced doerId with assignedTo
    task.status = 'completed';
    await task.save();
    return task;
  } catch (err) {
    throw new Error('Error completing task');
  }
};

// Edit Task
const editTask = async (taskId, title, description, difficulty, createdBy) => {  // Changed posterId to createdBy
  try {
    const task = await Task.findById(taskId);
    if (!task) throw new Error('Task not found');
    if (String(task.createdBy) !== createdBy) throw new Error('Not authorized to edit this task');  // Replaced posterId with createdBy
    task.title = title || task.title;
    task.description = description || task.description;
    task.difficulty = difficulty || task.difficulty;
    await task.save();
    return task;
  } catch (err) {
    throw new Error('Error editing task');
  }
};

// Cancel Task
const cancelTask = async (taskId, createdBy) => {  // Changed posterId to createdBy
  try {
    const task = await Task.findById(taskId);
    if (!task) throw new Error('Task not found');
    if (String(task.createdBy) !== createdBy) throw new Error('Not authorized to cancel this task');  // Replaced posterId with createdBy
    if (task.status !== 'open') throw new Error('Task is already in progress or completed');
    task.status = 'canceled';
    await task.save();
    return task;
  } catch (err) {
    throw new Error('Error Canceling Task');
  }
};

// Delete Task
const deleteTask = async (taskId) => {
  try {
    const task = await Task.findByIdAndDelete(taskId);
    if (!task) throw new Error('Task not found');
    return task;
  } catch (err) {
    throw new Error('Error Deleting Task');
  }
};


module.exports = {
  createTask,
  acceptTask,
  getAllTasks,
  getMyPostedTasks,
  getMyAcceptedTasks,
  completeTask,
  editTask,
  cancelTask,
  deleteTask
};
