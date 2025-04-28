const express = require('express');
const authenticate = require('../middleware/authenticate');
const Task = require('../models/Task');
const router = express.Router();

//Post Task
router.post('/task/post', authenticate, async (req, res) => {
  const { title, description, difficulty } = req.body;
  try {
    const task = new Task({
      title,
      description,
      difficulty,
      posterId: req.user,
    });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

//Accept Task
router.put('/task/accept/:taskId', authenticate, async (req, res) => {
    const taskId = req.params.taskId;
    try {
      const task = await Task.findById(taskId);
      if (!task) return res.status(404).json({ msg: 'Task not found' });
  
      if (task.status !== 'open') return res.status(400).json({ msg: 'Task is no longer available' });
  
      task.status = 'in-progress';
      task.doerId = req.user; // Assign the doer
      await task.save();
      res.json({ msg: 'Task accepted successfully', task });
    } catch (err) {
      res.status(500).json({ msg: 'Server error' });
    }
  });
  
//Get all Tasks
router.get('/task/list', authenticate, async (req, res) => {
  const { difficulty } = req.query; // Query parameter for difficulty
  try {
    const filter = difficulty ? { status: 'open', difficulty } : { status: 'open' };
    const tasks = await Task.find(filter);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Tasks posted by current user
router.get('/task/my-post', authenticate, async (req, res) => {
    try {
      const tasks = await Task.find({ posterId: req.user });
      res.json(tasks);
    } catch (err) {
      res.status(500).json({ msg: 'Server error' });
    }
  });
  
  // Tasks accepted by current user
  router.get('/task/my-job', authenticate, async (req, res) => {
    try {
      const tasks = await Task.find({ doerId: req.user });
      res.json(tasks);
    } catch (err) {
      res.status(500).json({ msg: 'Server error' });
    }
  });
  
  //Task Completion
  router.put('/task/complete/:taskId', authenticate, async (req, res) => {
    try {
      const task = await Task.findById(req.params.taskId);
      if (!task) return res.status(404).json({ msg: 'Task not found' });
  
      if (String(task.doerId) !== req.user)
        return res.status(403).json({ msg: 'Not authorized to complete this task' });
  
      task.status = 'completed';
      await task.save();
  
      res.json(task);
    } catch (err) {
      res.status(500).json({ msg: 'Server error' });
    }
  });

  //Edit Task
  router.put('/task/edit/:taskId', authenticate, async (req, res) => {
    const { title, description, difficulty } = req.body;
    try {
      const task = await Task.findById(req.params.taskId);
      if (!task) return res.status(404).json({ msg: 'Task not found' });
      
      if (String(task.posterId) !== req.user)
        return res.status(403).json({ msg: 'You are not authorized to edit this task' });
      
      task.title = title || task.title;
      task.description = description || task.description;
      task.difficulty = difficulty || task.difficulty;
      
      await task.save();
      res.json(task);
    } catch (err) {
      res.status(500).json({ msg: 'Server error' });
    }
  });
  
  //Cancel Task
  router.put('/task/cancel/:taskId', authenticate, async (req, res) => {
    try {
      const task = await Task.findById(req.params.taskId);
      if (!task) return res.status(404).json({ msg: 'Task not found' });
  
      if (String(task.posterId) !== req.user)
        return res.status(403).json({ msg: 'Not authorized to cancel this task' });
  
      if (task.status !== 'open')
        return res.status(400).json({ msg: 'Task is already in progress or completed' });
  
      task.status = 'canceled';
      await task.save();
      res.json({ msg: 'Task canceled' });
    } catch (err) {
      res.status(500).json({ msg: 'Server error' });
    }
  });
  
  
module.exports = router;
