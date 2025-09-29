const Task = require('../models/Task');

// Create Task
const createTask = async (title, description, difficulty, category, location, deadline, createdBy) => {
  try {
    // Check for duplicate tasks
    const existingTask = await Task.findOne({ title, description, createdBy });
    if (existingTask) {
      throw new Error('A task with the same title and description already exists.');
    }

    // Create a new task
    const task = new Task({
      title,
      description,
      difficulty,
      category,
      location,
      deadline,
      createdBy,
    });
    await task.save();
    return task;
  } catch (err) {
    throw new Error(err.message || 'Error creating task');
  }
};

// Accept Task
const acceptTask = async (taskId, assignedTo) => {  
  try {
    const task = await Task.findById(taskId);
    if (!task) throw new Error('Task not found');
    if (task.createdBy.toString() === assignedTo.toString()) throw new Error('Cannot Accept Own Task');  
    if (task.status !== 'open') throw new Error('Task is no longer available');
    task.status = 'in-progress';
    task.assignedTo = assignedTo; 
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
    const tasks = await Task.find(filter).populate('createdBy', 'name');
    return tasks;
  } catch (err) {
    throw new Error('Error fetching tasks');
  }
};

// Get Tasks Posted by Current User
const getMyPostedTasks = async (userId) => {
  try {
    return await Task.find({ createdBy: userId }); // Ensure `createdBy` is the correct field in your Task model
  } catch (err) {
    throw new Error('Error fetching posted tasks');
  }
};

// Get Tasks Accepted by Current User
const getMyAcceptedTasks = async (userId) => {
  try {
    return await Task.find({ assignedTo: userId, status: 'in-progress' });
  } catch (err) {
    throw new Error('Error fetching accepted tasks');
  }
};

// Get Tasks Completed by Current User
const getMyCompletedTasks = async (userId) => {
  try {
    return await Task.find({ assignedTo: userId, status: 'completed' });
  } catch (err) {
    throw new Error('Error fetching completed tasks');
  }
};

// Complete Task
const completeTask = async (taskId, assignedTo) => {  
  try {
    const task = await Task.findById(taskId);
    if (!task) throw new Error('Task not found');
    if (String(task.assignedTo) !== assignedTo) throw new Error('Not authorized to complete this task'); 
    task.status = 'completed';
    await task.save();
    return task;
  } catch (err) {
    throw new Error('Error completing task');
  }
};

// Edit Task
const editTask = async (taskId, title, description, difficulty, category, location, deadline, userId) => {
  try {
    console.log('Edit Task Service Input:', { taskId, userId }); // Debugging log
    const task = await Task.findById(taskId);
    console.log('Task Found:', task); // Debugging log
    if (!task) throw new Error('Task not found');
    if (String(task.createdBy) !== String(userId)) throw new Error('Not authorized to edit this task'); // Fix comparison
    task.title = title || task.title;
    task.description = description || task.description;
    task.difficulty = difficulty || task.difficulty;
    task.category = category || task.category;
    task.location = location || task.location;
    task.deadline = deadline || task.deadline;
    await task.save();
    return task;
  } catch (err) {
    console.error('Error in editTask Service:', err.message); // Debugging log
    throw new Error(err.message || 'Error editing task');
  }
};

// Cancel Task
const cancelTask = async (taskId, createdBy) => {  
  try {
    const task = await Task.findById(taskId);
    if (!task) throw new Error('Task not found');
    if (String(task.createdBy) !== createdBy) throw new Error('Not authorized to cancel this task');  
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
  getMyCompletedTasks,
  completeTask,
  editTask,
  cancelTask,
  deleteTask
};
